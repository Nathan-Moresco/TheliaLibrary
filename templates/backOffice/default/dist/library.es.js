import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import axios from 'axios';

function Image({ classes, reff, src }) {
    return (React.createElement("img", { className: classes, ref: reff, src: src }));
}

const CURRENT_LOCAL = "en_US";

const API_URL = "/open_api/library/image";
// API
async function getAllImages(params) {
    return axios.get(API_URL, {
        params: {
            ...params,
        },
    });
}
function createImage(data) {
    return axios.post(API_URL, data, {
        headers: {
            "content-type": "multipart/form-data",
        },
    });
}
function updateImage(id, data) {
    return axios.post(API_URL + "/" + id, data, {
        headers: {
            "content-type": "multipart/form-data",
        },
    });
}
function deleteImage(id) {
    return axios.delete(API_URL + "/" + id);
}

function ManageDetails({ id, title, croppedFile, onAdd, onEdit, onImgPick, onTitleChange, emptyPreview, }) {
    const fileInputRef = React.useRef(null);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);
    const [localTitle, setLocalTitle] = React.useState("");
    React.useEffect(() => {
        if (isSuccess) {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [isSuccess, fileInputRef]);
    React.useEffect(() => {
        setLocalTitle(title);
    }, [title, setLocalTitle]);
    return (React.createElement("div", null,
        React.createElement("form", { autoComplete: "off", className: "TheliaLibrary-ImagePreview", onSubmit: (e) => {
                e.preventDefault();
                setIsPending(true);
                setIsSuccess(false);
                setError(false);
                const data = new FormData(e.currentTarget);
                if (!data.has("locale")) {
                    data.set("locale", CURRENT_LOCAL);
                }
                if (croppedFile) {
                    data.set("image", croppedFile, "cropped.png");
                }
                if (id === 0) {
                    createImage(data)
                        .then((response) => {
                        onAdd(response.data);
                        setIsSuccess(true);
                        emptyPreview();
                    })
                        .catch((e) => setError(e.message))
                        .finally(() => {
                        setIsPending(false);
                    });
                }
                else {
                    updateImage(id, data)
                        .then((response) => {
                        onEdit(response.data);
                        setIsSuccess(true);
                        emptyPreview();
                    })
                        .catch((e) => setError(e.message))
                        .finally(() => {
                        setIsPending(false);
                    });
                }
            } },
            React.createElement("div", { className: "text-center" },
                React.createElement("label", { className: "custom-file-upload" },
                    React.createElement("input", { type: "file", name: "image", ref: fileInputRef, className: "form-control input-chose-img", onChange: (e) => { onImgPick(e, id, title); } }),
                    "Choisir une Image"),
                React.createElement("div", { className: "TheliaLibrary-Thumbnail-title" },
                    React.createElement("label", { htmlFor: "title", className: "control-label" }, "Titre de l'image"),
                    React.createElement("input", { type: "text", name: "title", value: localTitle, className: "text-center form-control input-chose-title", onChange: (e) => {
                            setLocalTitle(e.target.value);
                            onTitleChange(e.target.value);
                        } })),
                React.createElement("button", { type: "submit", disabled: isPending, className: "form-submit-button btn-green" }, " Valider Image "),
                React.createElement("button", { type: "button", onClick: () => emptyPreview(), className: "btn-red" }, " Fermer "),
                isSuccess ? React.createElement("div", { className: "success-msg" }, "Succes") : null,
                error ? React.createElement("div", { className: "error-msg" },
                    console.log(error),
                    " Echec, veuillez recommencer") : null))));
}

function ManageImage({ id, title, src, dynamicPush, setImgPreview, emptyPreview, storeImg }) {
    const [croppedImageUrl, setCroppedImageUrl] = useState(src);
    const [croppedImage, setCroppedImage] = useState({ lastModified: 0, lastModifiedDate: null, name: "", size: 0, type: "", webkitRelativePath: "" });
    const imageRef = useRef(null);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });
    function validCrop(useCrop) {
        if (useCrop.height === 0) {
            if (useCrop.width === 0) {
                return false;
            }
            return false;
        }
        return true;
    }
    function onCropChange(newCrop, percentCrop) {
        if (isNaN(percentCrop.x)) {
            percentCrop.x = 0;
        }
        if (isNaN(percentCrop.y)) {
            percentCrop.y = 0;
        }
        if (validCrop(percentCrop)) {
            setCrop(percentCrop);
        }
    }
    function onCropComplete(newCrop) {
        if (validCrop(newCrop)) {
            getCroppedImg(imageRef.current, newCrop);
        }
    }
    //: React.RefObject<HTMLImageElement>
    function getCroppedImg(image, usedCrop) {
        if (image) {
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = usedCrop.width;
            canvas.height = usedCrop.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(image, usedCrop.x * scaleX, usedCrop.y * scaleY, usedCrop.width * scaleX, usedCrop.height * scaleY, 0, 0, usedCrop.width, usedCrop.height);
            }
            const reader = new FileReader();
            canvas.toBlob(blob => {
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    setCroppedImageUrl(reader.result);
                    dataURLtoFile(reader.result, 'cropped.jpg');
                    setImgPreview(title, reader.result);
                };
            });
        }
    }
    function dataURLtoFile(dataurl, filename) {
        if (dataurl) {
            let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            let croppedImage = new File([u8arr], filename, { type: mime });
            setCroppedImage(croppedImage);
        }
    }
    return (React.createElement("div", { className: "TheliaLibrary-Edit-Image-Content" },
        React.createElement("div", { className: "col-span-3 Cropper-Block" },
            React.createElement("img", { src: src, ref: imageRef, className: "display-none" }),
            src && (React.createElement(ReactCrop, { src: src, crop: crop, locked: false, ruleOfThirds: true, onComplete: (completedCrop) => onCropComplete(completedCrop), onChange: (changedCrop, percentCrop) => { onCropChange(changedCrop, percentCrop); } }))),
        React.createElement("div", { className: "col-span-1 Edit-Details-Block" },
            React.createElement("button", { type: "button", className: "RefreshCrop-Btn", onClick: () => setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 }) }, " \u00D8 "),
            React.createElement(ManageDetails, { id: id, title: title, croppedFile: croppedImage, onAdd: (response) => {
                    dynamicPush(response);
                }, onEdit: (response) => {
                    dynamicPush(response);
                }, onImgPick: (e, id, title) => {
                    emptyPreview();
                    storeImg(e, id, title);
                }, onTitleChange: (newTitle) => {
                    storeImg(null, id, newTitle, src);
                    if (croppedImageUrl) {
                        setImgPreview(newTitle, croppedImageUrl);
                    }
                }, emptyPreview: () => emptyPreview() }))));
}

function ImageView({ id, title, url, setImgEditing = () => { } }) {
    const fileInputRef = React.useRef(null);
    const [isSuccess] = React.useState(false);
    React.useEffect(() => {
        if (isSuccess) {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [isSuccess, fileInputRef]);
    return (React.createElement("div", null,
        React.createElement("a", { className: "link-update-img", onClick: (e) => {
                setImgEditing(e, id, title);
            } },
            React.createElement(Image, { classes: "", reff: null, src: url }),
            React.createElement("div", { className: "TheliaLibrary-Thumbnail-Complete-title" },
                id,
                " - ",
                React.createElement("b", { className: "TheliaLibrary-Thumbnail-title" }, (title ? title : ""))))));
}

function Thumbnail({ id, url, title, onDelete = () => { }, setImgEditing, }) {
    if (!url)
        return null;
    return (React.createElement("div", { className: "TheliaLibrary-Thumbnail" },
        React.createElement("div", { className: "text-center" },
            React.createElement(ImageView, { id: id, title: title, url: url, setImgEditing: (e, id, title) => setImgEditing(e, id, title) }),
            React.createElement("button", { className: "btn-red", onClick: () => {
                    if (window.confirm("Etes vous sur ?")) {
                        deleteImage(id).then(() => onDelete(id));
                    }
                } },
                " ",
                React.createElement("span", null, " Supprimer"),
                " "))));
}

function Grid({ data, loading, error, arrayImages, setArrayImages, setImgEditing }) {
    useEffect(() => {
        setArrayImages(data);
    }, [data]);
    if (error) {
        return React.createElement("div", { className: "error-msg" },
            " ",
            error,
            " ");
    }
    if (loading) {
        return React.createElement("div", { className: "loading-msg" }, " Loading ");
    }
    function deleteFromArray(id) {
        if (!Array.isArray(arrayImages)) {
            return;
        }
        let tempArr = arrayImages.filter((itemFromArray) => {
            if (id !== null) {
                if (id === itemFromArray.id) {
                    return false;
                }
                return true;
            }
        });
        setArrayImages(tempArr);
    }
    return (React.createElement("div", { className: "TheliaLibrary-grid" }, (arrayImages.length >= 1) ? (arrayImages?.map((item) => {
        return (React.createElement(Thumbnail, { ...item, key: item.id, onDelete: (id) => { deleteFromArray(id); }, setImgEditing: (e, id, title) => { setImgEditing(e, id, title); } }));
    })) : (React.createElement("div", { className: "TheliaLibrary-EmptyGrid" },
        React.createElement("span", null, "Aucun R\u00E9sultat")))));
}

// hooks
function useAllImages(offset = 1, limit, title = "") {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const fetch = (offset, limit, title) => {
        setLoading(true);
        getAllImages({ locale: CURRENT_LOCAL, offset, limit, title })
            .then((response) => {
            setData(response.data);
        })
            .catch((e) => setError(e.message))
            .finally(() => {
            setLoading(false);
        });
    };
    React.useEffect(() => {
        fetch(offset, limit, title);
    }, [offset, limit, title]);
    return {
        fetch,
        data,
        loading,
        error,
    };
}
function App() {
    const imgPreview = useRef(null);
    const titlePreview = useRef(null);
    const [arrayImages, setArrayImages] = useState([]);
    const [selectedId, setSelectedId] = React.useState(0);
    const [selectedTitle, setSelectedTitle] = React.useState("img");
    const [selectedSrc, setSelectedSrc] = React.useState(""); //URL img Modal
    const [queryTitle, setQueryTitle] = React.useState("");
    const [offset, setOffset] = React.useState(0);
    const [limit, setLimit] = React.useState(24);
    const { data, loading, error } = useAllImages(offset, limit, queryTitle);
    // Preview
    function managePreview(title, img) {
        if (imgPreview.current) { //IMAGE
            if (selectedSrc === "") {
                imgPreview.current.src = ""; //DEFAULT IMG
            }
            else {
                if (!img) {
                    imgPreview.current.src = selectedSrc;
                }
                else {
                    imgPreview.current.src = img;
                }
            }
        }
        if (titlePreview.current) { // TITRE
            titlePreview.current.innerHTML = "";
            if (selectedId == 0) {
                if (data) {
                    if (data.length > 0) {
                        let newId = data[data.length - 1].id + 1;
                        titlePreview.current.append(newId + " - " + title);
                    }
                    else {
                        titlePreview.current.append("1 - " + title);
                    }
                }
                else {
                    titlePreview.current.append("1 - " + title);
                }
            }
            else {
                titlePreview.current.append(selectedId + " - " + title);
            }
        }
    }
    function emptyPreview() {
        if (imgPreview.current) {
            imgPreview.current.src = "";
        }
        if (titlePreview.current) {
            titlePreview.current.innerHTML = "";
        }
        setSelectedId(0);
        setSelectedTitle("img");
        setSelectedSrc("");
    }
    //Image Changing
    function storeImg(cible, id, title, imgCropped = "") {
        // 1 - Placer les paramètres dans les States (Image en cours d'Edition)
        // 2 - Lancer la Preview
        var img = "";
        setSelectedId(id);
        setSelectedTitle(title);
        if (cible) {
            if (cible.target.src) { //Image déjà présente
                setSelectedSrc(cible.target.src);
                img = cible.target.src;
            }
            else if (cible.target.files.length) { //Image choisie avec Input
                var reader = new FileReader();
                reader.onload = (function (readerLoadedImgPreview) {
                    return function (e) {
                        if (readerLoadedImgPreview.current) {
                            readerLoadedImgPreview.current.src = e.target.result;
                            setSelectedSrc(e.target.result);
                            img = e.target.result;
                        }
                    };
                })(imgPreview);
                reader.readAsDataURL(cible.target.files[0]);
            }
            else {
                console.log("cible.target.src is null : ", cible);
            }
        }
        else {
            if (imgCropped) {
                setSelectedSrc(imgCropped);
                img = imgCropped;
            }
        }
        managePreview(title, img);
    }
    //Grid Array
    function pushToArray(item) {
        if (!Array.isArray(arrayImages)) {
            return;
        }
        let tempArr = arrayImages.map((itemFromArray) => {
            if (item !== null) {
                if (item.id === itemFromArray.id) {
                    return item;
                }
                return itemFromArray;
            }
        });
        setArrayImages(tempArr);
    }
    return (React.createElement("div", { className: "bg-red-100" },
        React.createElement("div", { className: "Settings" },
            React.createElement("div", { className: "col-span-5 Settings-Title" },
                React.createElement("span", null, "Espace Edition")),
            React.createElement("div", { className: "col-span-2 Settings-Title" },
                React.createElement("span", null, "Visualisation")),
            React.createElement("div", { className: "col-span-5" },
                React.createElement("div", { className: "TheliaLibrary-EditImage" },
                    React.createElement(ManageImage, { id: selectedId, title: selectedTitle, src: selectedSrc, dynamicPush: (responseData) => {
                            pushToArray(responseData);
                        }, emptyPreview: () => emptyPreview(), storeImg: (e, id, title, image) => storeImg(e, id, title, image), setImgPreview: (title, croppedImg) => {
                            managePreview(title, croppedImg);
                        } }))),
            React.createElement("div", { className: "col-span-2" },
                React.createElement("div", { className: "TheliaLibrary-ImgPreview" },
                    React.createElement("div", null,
                        React.createElement(Image, { classes: "img-preview", reff: imgPreview, src: "" })),
                    React.createElement("span", { className: "title-preview", ref: titlePreview })))),
        React.createElement("div", { className: "line-grid-actions" },
            React.createElement("button", { className: "btn-page-previous", disabled: limit > offset, onClick: () => {
                    setOffset(offset - limit);
                } },
                " ",
                React.createElement("i", { className: "glyphicon glyphicon-chevron-left" }),
                " "),
            React.createElement("button", { className: "btn-page-next", disabled: Array.isArray(data) && data?.length < limit, onClick: () => {
                    setOffset(offset + limit);
                } },
                " ",
                React.createElement("i", { className: "glyphicon glyphicon-chevron-right" }),
                " "),
            React.createElement("span", { className: "page-Indicator" },
                "Page ",
                React.createElement("b", null, (offset / limit) + 1)),
            React.createElement("span", { className: "line-number" },
                " Nombre de Lignes ",
                React.createElement("input", { className: "line-number-input", type: "number", min: "1", onChange: (e) => setLimit(e.target.value * 8) })),
            React.createElement("span", { className: "nb-products" },
                " Nombre de Produits : ",
                data ? data.length : 0),
            React.createElement("button", { className: "all-products", onClick: () => {
                    if (window.confirm("Si tous les produits sont chargés, il se peut que votre navigateur soit bloqué. Continuer ?")) {
                        setLimit(9999);
                    }
                } }, "Afficher toutes les Images"),
            React.createElement("input", { type: "text", value: queryTitle, className: "inline text-left form-control input-chose-title query-title", onChange: (e) => {
                    setQueryTitle(e.target.value);
                }, placeholder: "Recherche par Titre" })),
        React.createElement(Grid, { arrayImages: arrayImages, setArrayImages: (array) => setArrayImages(array), data: data, loading: loading, error: error, setImgEditing: (e, id, title) => {
                emptyPreview();
                storeImg(e, id, title);
            } })));
}

export { App };

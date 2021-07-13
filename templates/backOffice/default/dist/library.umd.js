(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-image-crop'), require('axios')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-image-crop', 'axios'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TheliaLibrary = {}, global.React, global.ReactCrop, global.axios));
}(this, (function (exports, React, ReactCrop, axios) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var ReactCrop__default = /*#__PURE__*/_interopDefaultLegacy(ReactCrop);
    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

    function Image({ classes, reff, src }) {
        return (React__default['default'].createElement("img", { className: classes, ref: reff, src: src }));
    }

    const CURRENT_LOCAL = "en_US";

    const API_URL = "/open_api/library/image";
    // API
    async function getAllImages(params) {
        return axios__default['default'].get(API_URL, {
            params: {
                ...params,
            },
        });
    }
    function createImage(data) {
        return axios__default['default'].post(API_URL, data, {
            headers: {
                "content-type": "multipart/form-data",
            },
        });
    }
    function updateImage(id, data) {
        return axios__default['default'].post(API_URL + "/" + id, data, {
            headers: {
                "content-type": "multipart/form-data",
            },
        });
    }
    function deleteImage(id) {
        return axios__default['default'].delete(API_URL + "/" + id);
    }

    function ManageDetails({ id, title, croppedFile, onAdd, onEdit, onImgPick, onTitleChange, emptyPreview, }) {
        const fileInputRef = React__default['default'].useRef(null);
        const [isSuccess, setIsSuccess] = React__default['default'].useState(false);
        const [error, setError] = React__default['default'].useState(false);
        const [isPending, setIsPending] = React__default['default'].useState(false);
        const [localTitle, setLocalTitle] = React__default['default'].useState("");
        React__default['default'].useEffect(() => {
            if (isSuccess) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }, [isSuccess, fileInputRef]);
        React__default['default'].useEffect(() => {
            setLocalTitle(title);
        }, [title, setLocalTitle]);
        return (React__default['default'].createElement("div", null,
            React__default['default'].createElement("form", { autoComplete: "off", className: "TheliaLibrary-ImagePreview", onSubmit: (e) => {
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
                React__default['default'].createElement("div", { className: "text-center" },
                    React__default['default'].createElement("label", { className: "custom-file-upload" },
                        React__default['default'].createElement("input", { type: "file", name: "image", ref: fileInputRef, className: "form-control input-chose-img", onChange: (e) => { onImgPick(e, id, title); } }),
                        "Choisir une Image"),
                    React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail-title" },
                        React__default['default'].createElement("label", { htmlFor: "title", className: "control-label" }, "Titre de l'image"),
                        React__default['default'].createElement("input", { type: "text", name: "title", value: localTitle, className: "text-center form-control input-chose-title", onChange: (e) => {
                                setLocalTitle(e.target.value);
                                onTitleChange(e.target.value);
                            } })),
                    React__default['default'].createElement("button", { type: "submit", disabled: isPending, className: "form-submit-button btn-green" }, " Valider Image "),
                    React__default['default'].createElement("button", { type: "button", onClick: () => emptyPreview(), className: "btn-red" }, " Fermer "),
                    isSuccess ? React__default['default'].createElement("div", { className: "success-msg" }, "Succes") : null,
                    error ? React__default['default'].createElement("div", { className: "error-msg" },
                        console.log(error),
                        " Echec, veuillez recommencer") : null))));
    }

    function ManageImage({ id, title, src, dynamicPush, setImgPreview, emptyPreview, storeImg }) {
        const [croppedImageUrl, setCroppedImageUrl] = React.useState(src);
        const [croppedImage, setCroppedImage] = React.useState({ lastModified: 0, lastModifiedDate: null, name: "", size: 0, type: "", webkitRelativePath: "" });
        const imageRef = React.useRef(null);
        const [crop, setCrop] = React.useState({
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
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-Edit-Image-Content" },
            React__default['default'].createElement("div", { className: "col-span-3 Cropper-Block" },
                React__default['default'].createElement("img", { src: src, ref: imageRef, className: "display-none" }),
                src && (React__default['default'].createElement(ReactCrop__default['default'], { src: src, crop: crop, locked: false, ruleOfThirds: true, onComplete: (completedCrop) => onCropComplete(completedCrop), onChange: (changedCrop, percentCrop) => { onCropChange(changedCrop, percentCrop); } }))),
            React__default['default'].createElement("div", { className: "col-span-1 Edit-Details-Block" },
                React__default['default'].createElement("button", { type: "button", className: "RefreshCrop-Btn", onClick: () => setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 }) }, " \u00D8 "),
                React__default['default'].createElement(ManageDetails, { id: id, title: title, croppedFile: croppedImage, onAdd: (response) => {
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
        const fileInputRef = React__default['default'].useRef(null);
        const [isSuccess] = React__default['default'].useState(false);
        React__default['default'].useEffect(() => {
            if (isSuccess) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }, [isSuccess, fileInputRef]);
        return (React__default['default'].createElement("div", null,
            React__default['default'].createElement("a", { className: "link-update-img", onClick: (e) => {
                    setImgEditing(e, id, title);
                } },
                React__default['default'].createElement(Image, { classes: "", reff: null, src: url }),
                React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail-Complete-title" },
                    id,
                    " - ",
                    React__default['default'].createElement("b", { className: "TheliaLibrary-Thumbnail-title" }, (title ? title : ""))))));
    }

    function Thumbnail({ id, url, title, onDelete = () => { }, setImgEditing, }) {
        if (!url)
            return null;
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail" },
            React__default['default'].createElement("div", { className: "text-center" },
                React__default['default'].createElement(ImageView, { id: id, title: title, url: url, setImgEditing: (e, id, title) => setImgEditing(e, id, title) }),
                React__default['default'].createElement("button", { className: "btn-red", onClick: () => {
                        if (window.confirm("Etes vous sur ?")) {
                            deleteImage(id).then(() => onDelete(id));
                        }
                    } },
                    " ",
                    React__default['default'].createElement("span", null, " Supprimer"),
                    " "))));
    }

    function Grid({ data, loading, error, arrayImages, setArrayImages, setImgEditing }) {
        React.useEffect(() => {
            setArrayImages(data);
        }, [data]);
        if (error) {
            return React__default['default'].createElement("div", { className: "error-msg" },
                " ",
                error,
                " ");
        }
        if (loading) {
            return React__default['default'].createElement("div", { className: "loading-msg" }, " Loading ");
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
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-grid" }, (arrayImages.length >= 1) ? (arrayImages?.map((item) => {
            return (React__default['default'].createElement(Thumbnail, { ...item, key: item.id, onDelete: (id) => { deleteFromArray(id); }, setImgEditing: (e, id, title) => { setImgEditing(e, id, title); } }));
        })) : (React__default['default'].createElement("div", { className: "TheliaLibrary-EmptyGrid" },
            React__default['default'].createElement("span", null, "Aucun R\u00E9sultat")))));
    }

    // hooks
    function useAllImages(offset = 1, limit, title = "") {
        const [data, setData] = React__default['default'].useState(null);
        const [loading, setLoading] = React__default['default'].useState(false);
        const [error, setError] = React__default['default'].useState(null);
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
        React__default['default'].useEffect(() => {
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
        const imgPreview = React.useRef(null);
        const titlePreview = React.useRef(null);
        const [arrayImages, setArrayImages] = React.useState([]);
        const [selectedId, setSelectedId] = React__default['default'].useState(0);
        const [selectedTitle, setSelectedTitle] = React__default['default'].useState("img");
        const [selectedSrc, setSelectedSrc] = React__default['default'].useState(""); //URL img Modal
        const [queryTitle, setQueryTitle] = React__default['default'].useState("");
        const [offset, setOffset] = React__default['default'].useState(0);
        const [limit, setLimit] = React__default['default'].useState(24);
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
        return (React__default['default'].createElement("div", { className: "bg-red-100" },
            React__default['default'].createElement("div", { className: "Settings" },
                React__default['default'].createElement("div", { className: "col-span-5 Settings-Title" },
                    React__default['default'].createElement("span", null, "Espace Edition")),
                React__default['default'].createElement("div", { className: "col-span-2 Settings-Title" },
                    React__default['default'].createElement("span", null, "Visualisation")),
                React__default['default'].createElement("div", { className: "col-span-5" },
                    React__default['default'].createElement("div", { className: "TheliaLibrary-EditImage" },
                        React__default['default'].createElement(ManageImage, { id: selectedId, title: selectedTitle, src: selectedSrc, dynamicPush: (responseData) => {
                                pushToArray(responseData);
                            }, emptyPreview: () => emptyPreview(), storeImg: (e, id, title, image) => storeImg(e, id, title, image), setImgPreview: (title, croppedImg) => {
                                managePreview(title, croppedImg);
                            } }))),
                React__default['default'].createElement("div", { className: "col-span-2" },
                    React__default['default'].createElement("div", { className: "TheliaLibrary-ImgPreview" },
                        React__default['default'].createElement("div", null,
                            React__default['default'].createElement(Image, { classes: "img-preview", reff: imgPreview, src: "" })),
                        React__default['default'].createElement("span", { className: "title-preview", ref: titlePreview })))),
            React__default['default'].createElement("div", { className: "line-grid-actions" },
                React__default['default'].createElement("button", { className: "btn-page-previous", disabled: limit > offset, onClick: () => {
                        setOffset(offset - limit);
                    } },
                    " ",
                    React__default['default'].createElement("i", { className: "glyphicon glyphicon-chevron-left" }),
                    " "),
                React__default['default'].createElement("button", { className: "btn-page-next", disabled: Array.isArray(data) && data?.length < limit, onClick: () => {
                        setOffset(offset + limit);
                    } },
                    " ",
                    React__default['default'].createElement("i", { className: "glyphicon glyphicon-chevron-right" }),
                    " "),
                React__default['default'].createElement("span", { className: "page-Indicator" },
                    "Page ",
                    React__default['default'].createElement("b", null, (offset / limit) + 1)),
                React__default['default'].createElement("span", { className: "line-number" },
                    " Nombre de Lignes ",
                    React__default['default'].createElement("input", { className: "line-number-input", type: "number", min: "1", onChange: (e) => setLimit(e.target.value * 8) })),
                React__default['default'].createElement("span", { className: "nb-products" },
                    " Nombre de Produits : ",
                    data ? data.length : 0),
                React__default['default'].createElement("button", { className: "all-products", onClick: () => {
                        if (window.confirm("Si tous les produits sont chargés, il se peut que votre navigateur soit bloqué. Continuer ?")) {
                            setLimit(9999);
                        }
                    } }, "Afficher toutes les Images"),
                React__default['default'].createElement("input", { type: "text", value: queryTitle, className: "inline text-left form-control input-chose-title query-title", onChange: (e) => {
                        setQueryTitle(e.target.value);
                    }, placeholder: "Recherche par Titre" })),
            React__default['default'].createElement(Grid, { arrayImages: arrayImages, setArrayImages: (array) => setArrayImages(array), data: data, loading: loading, error: error, setImgEditing: (e, id, title) => {
                    emptyPreview();
                    storeImg(e, id, title);
                } })));
    }

    exports.App = App;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

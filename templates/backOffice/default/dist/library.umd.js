(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('axios'), require('react-image-crop')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'axios', 'react-image-crop'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TheliaLibrary = {}, global.React, global.axios, global.ReactCrop));
}(this, (function (exports, React, axios, ReactCrop) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
    var ReactCrop__default = /*#__PURE__*/_interopDefaultLegacy(ReactCrop);

    const CURRENT_LOCAL = "en_US";

    function Image({ classes, src }) {
        return React__default['default'].createElement("img", { className: classes, src: src });
    }

    function ImageView({ id, title, url, setImgEditing = () => { }, }) {
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
                    setImgEditing(e, { id, title, url });
                } },
                React__default['default'].createElement(Image, { classes: "", src: url }),
                React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail-Complete-title" },
                    id,
                    " -",
                    " ",
                    React__default['default'].createElement("b", { className: "TheliaLibrary-Thumbnail-title" }, title ? title : "")))));
    }

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

    function Thumbnail({ id, url, title, onDelete = () => { }, setImgEditing, }) {
        if (!url)
            return null;
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail" },
            React__default['default'].createElement("div", { className: "text-center" },
                React__default['default'].createElement(ImageView, { id: id, title: title, url: url, setImgEditing: () => setImgEditing() }),
                React__default['default'].createElement("button", { className: "btn-red", onClick: () => {
                        if (window.confirm("Etes vous sur ?")) {
                            deleteImage(id).then(() => onDelete(id));
                        }
                    } },
                    " ",
                    React__default['default'].createElement("span", null, " Supprimer"),
                    " "))));
    }

    function Grid({ loading, error, images, onDelete, setImgEditing, }) {
        if (error) {
            return React__default['default'].createElement("div", { className: "error-msg" },
                " ",
                error,
                " ");
        }
        if (loading) {
            return React__default['default'].createElement("div", { className: "loading-msg" }, " Loading ");
        }
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-grid" }, images.length >= 1 ? (images?.map((item) => {
            return (React__default['default'].createElement(Thumbnail, { ...item, key: item.id, onDelete: onDelete, setImgEditing: () => {
                    setImgEditing(item);
                } }));
        })) : (React__default['default'].createElement("div", { className: "TheliaLibrary-EmptyGrid" },
            React__default['default'].createElement("span", null, "Aucun R\u00E9sultat")))));
    }

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
    function urltoFile(url, filename, mimeType) {
        return fetch(url)
            .then(function (res) {
            return res.arrayBuffer();
        })
            .then(function (buf) {
            return new File([buf], filename, { type: mimeType });
        });
    }
    function ManageDetails({ item, prependImage, onTitleChange, onPickImage, reset, }) {
        const fileInputRef = React__default['default'].useRef(null);
        const [files, setFiles] = React__default['default'].useState(null);
        const [isSuccess, setIsSuccess] = React__default['default'].useState(false);
        const [error, setError] = React__default['default'].useState(false);
        const [isPending, setIsPending] = React__default['default'].useState(false);
        const [localTitle, setLocalTitle] = React__default['default'].useState("");
        React__default['default'].useEffect(() => {
            if (isSuccess && fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }, [isSuccess, fileInputRef]);
        React__default['default'].useEffect(() => {
            if (item?.title) {
                setLocalTitle(item.title);
                onTitleChange(item);
            }
        }, [item, setLocalTitle]);
        React__default['default'].useEffect(() => {
            if (files && files[0]) {
                toBase64(files[0]).then((res) => {
                    if (typeof res === "string") {
                        onPickImage({
                            id: item?.id && item?.id !== "new" ? item.id : "new",
                            url: res,
                            title: "",
                        });
                    }
                });
            }
        }, [files]);
        return (React__default['default'].createElement("div", null,
            React__default['default'].createElement("form", { autoComplete: "off", className: "TheliaLibrary-ManageDetails", onSubmit: async (e) => {
                    e.preventDefault();
                    setIsPending(true);
                    setIsSuccess(false);
                    setError(false);
                    const data = new FormData(e.currentTarget);
                    if (!data.has("locale")) {
                        data.set("locale", CURRENT_LOCAL);
                    }
                    if (item?.url) {
                        const file = await urltoFile(item.url, item.title, "image/jpeg");
                        data.set("image", file, "cropped.png");
                    }
                    if (item?.id === "new") {
                        createImage(data)
                            .then((response) => {
                            prependImage(response.data);
                            setIsSuccess(true);
                            reset();
                        })
                            .catch((e) => setError(e.message))
                            .finally(() => {
                            setIsPending(false);
                        });
                    }
                    else if (item?.id) {
                        updateImage(item.id, data)
                            .then((response) => {
                            prependImage(response.data);
                            setIsSuccess(true);
                            reset();
                        })
                            .catch((e) => {
                            setError(e.message);
                        })
                            .finally(() => {
                            setIsPending(false);
                        });
                    }
                    else {
                        console.log("Nulle part : ", item);
                    }
                } },
                React__default['default'].createElement("div", { className: "text-center" },
                    React__default['default'].createElement("label", { className: "custom-file-upload" },
                        React__default['default'].createElement("input", { type: "file", name: "image", ref: fileInputRef, className: "form-control input-chose-img", onChange: (e) => {
                                setFiles(e.target.files);
                                if (item) {
                                    onPickImage({ id: item.id, url: item.url, title: item.title });
                                }
                            } }),
                        "Choisir une Image"),
                    React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail-title" },
                        React__default['default'].createElement("label", { htmlFor: "title", className: "control-label" }, "Titre de l'image"),
                        React__default['default'].createElement("input", { type: "text", name: "title", value: localTitle, className: "text-center form-control input-chose-title", onChange: (e) => {
                                setLocalTitle(e.target.value);
                                if (item) {
                                    onTitleChange({ id: item.id, url: item.url, title: e.target.value });
                                }
                            } })),
                    React__default['default'].createElement("button", { type: "submit", disabled: !item?.url || isPending, className: "form-submit-button btn-green" }, "Valider Image"),
                    React__default['default'].createElement("button", { type: "button", onClick: () => {
                            reset();
                        }, className: "btn-red" }, "Annuler"),
                    isSuccess ? React__default['default'].createElement("div", { className: "success-msg" }, "Succes") : null,
                    error ? (React__default['default'].createElement("div", { className: "error-msg" },
                        console.log(error),
                        " Echec, veuillez recommencer")) : null))));
    }

    function getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width || 0;
        canvas.height = crop.height || 0;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return Promise.reject("erreur: pas de canvas context");
        }
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    return Promise.reject("erreur: conversion en blob impossible");
                }
                blob.name = fileName;
                resolve(blob);
            }, "image/jpeg", 1);
        });
    }
    function ManageImage({ src, item, onModifyImage }) {
        const [imageRef, setImageRef] = React__default['default'].useState(null);
        const [crop, setCrop] = React.useState({
            unit: "%",
            width: 100,
            height: 100,
            x: 0,
            y: 0,
        });
        function onCropComplete(crop) {
            if (imageRef) {
                getCroppedImg(imageRef, crop, item.title).then((blob) => {
                    onModifyImage({
                        id: item.id || "new",
                        url: URL.createObjectURL(blob),
                        title: item.title,
                    });
                });
            }
        }
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-ManageImage" },
            React__default['default'].createElement("div", { className: "col-span-3 Cropper-Block" }, item && src && (React__default['default'].createElement(ReactCrop__default['default'], { src: src, crop: crop, locked: false, ruleOfThirds: true, onImageLoaded: (image) => {
                    setCrop({
                        unit: "px",
                        x: 0,
                        y: 0,
                        width: image.width,
                        height: image.height,
                    });
                    setImageRef(image);
                    return false;
                }, onComplete: onCropComplete, onChange: setCrop })))));
    }

    // hooks
    function useAllImages({ offset = 1, limit = 24, title = "" }) {
        const [data, setData] = React__default['default'].useState([]);
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
        const titlePreview = React.useRef(null);
        const [activeItem, setActiveItem] = React__default['default'].useState(null);
        const [unEditedSrc, setUneditedSrc] = React__default['default'].useState("");
        const [images, setImages] = React.useState([]);
        const [title, setTitle] = React__default['default'].useState("");
        const [offset, setOffset] = React__default['default'].useState(0);
        const [limit, setLimit] = React__default['default'].useState(24);
        const { data, loading, error } = useAllImages({ title, offset, limit });
        React__default['default'].useEffect(() => {
            setImages(data);
        }, [data]);
        React__default['default'].useEffect(() => {
            if (activeItem) {
                if (titlePreview.current) {
                    titlePreview.current.innerHTML = activeItem.title;
                }
            }
        });
        //Grid Array
        function prependImage(item) {
            if (!Array.isArray(images)) {
                return;
            }
            let tempArr = [...images];
            // if image already exists, update it, if it's a new image prepend it.
            if (images.some(({ id }) => id === item.id)) {
                tempArr = tempArr.map((itemFromArray) => {
                    if (item.id === itemFromArray.id) {
                        return item;
                    }
                    return itemFromArray;
                });
            }
            else {
                tempArr.push(item);
            }
            setImages(tempArr);
        }
        function deleteImage(id) {
            if (!Array.isArray(images)) {
                return;
            }
            let tempArr = images.filter((image) => {
                return id !== image.id;
            });
            setImages(tempArr);
        }
        return (React__default['default'].createElement("div", { className: "bg-red-100" },
            React__default['default'].createElement("div", { className: "Settings" },
                React__default['default'].createElement("div", { className: "col-span-5 Settings-Title" },
                    React__default['default'].createElement("span", null, "Espace Edition")),
                React__default['default'].createElement("div", { className: "col-span-2 Settings-Title" },
                    React__default['default'].createElement("span", null, "Visualisation")),
                React__default['default'].createElement("div", { className: "col-span-5" },
                    React__default['default'].createElement("div", { className: "TheliaLibrary-EditImage" },
                        React__default['default'].createElement(ManageImage, { src: unEditedSrc, item: activeItem, onModifyImage: (item) => setActiveItem(item) }),
                        React__default['default'].createElement(ManageDetails, { item: activeItem, onTitleChange: (item) => setActiveItem(item), onPickImage: (item) => {
                                setActiveItem(item);
                                setUneditedSrc(item.url);
                            }, prependImage: (item) => prependImage(item), reset: () => {
                                setActiveItem(null);
                                setUneditedSrc("");
                            } }))),
                React__default['default'].createElement("div", { className: "col-span-2" },
                    React__default['default'].createElement("div", { className: "TheliaLibrary-ImgPreview" },
                        React__default['default'].createElement("div", null,
                            React__default['default'].createElement(Image, { classes: "img-preview", src: activeItem?.url || "" })),
                        React__default['default'].createElement("span", { className: "title-preview", ref: titlePreview })))),
            React__default['default'].createElement("div", { className: "line-grid-actions" },
                React__default['default'].createElement("button", { className: "btn-page-previous", disabled: limit > offset, onClick: () => {
                        setOffset(offset - limit);
                    } },
                    " ",
                    React__default['default'].createElement("i", { className: "glyphicon glyphicon-chevron-left" }),
                    " "),
                React__default['default'].createElement("button", { className: "btn-page-next", disabled: Array.isArray(images) && images?.length < limit, onClick: () => {
                        setOffset(offset + limit);
                    } },
                    " ",
                    React__default['default'].createElement("i", { className: "glyphicon glyphicon-chevron-right" }),
                    " "),
                React__default['default'].createElement("span", { className: "page-Indicator" },
                    "Page ",
                    React__default['default'].createElement("b", null, offset / limit + 1)),
                React__default['default'].createElement("span", { className: "line-number" },
                    " ",
                    "Nombre de Lignes",
                    " ",
                    React__default['default'].createElement("input", { className: "line-number-input", type: "number", min: "1", onChange: (e) => setLimit(parseInt(e.target.value) * 8) })),
                React__default['default'].createElement("span", { className: "nb-products" },
                    " ",
                    "Nombre d'images : ",
                    images ? images.length : 0),
                React__default['default'].createElement("button", { className: "all-products", onClick: () => {
                        if (window.confirm("Si tous les produits sont chargés, il se peut que votre navigateur soit bloqué. Continuer ?")) {
                            setLimit(9999);
                        }
                    } }, "Afficher toutes les Images"),
                React__default['default'].createElement("input", { type: "text", value: title, className: "inline text-left form-control input-chose-title query-title", onChange: (e) => {
                        setTitle(e.target.value);
                    }, placeholder: "Recherche par Titre" })),
            React__default['default'].createElement(Grid, { images: images, loading: loading, error: error, setImgEditing: (image) => {
                    setActiveItem(image);
                    setUneditedSrc(image.url);
                }, onDelete: deleteImage })));
    }

    exports.App = App;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

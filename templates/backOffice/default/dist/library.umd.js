(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('axios')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'axios'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TheliaLibrary = {}, global.React, global.axios));
}(this, (function (exports, React, axios) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

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
    function deleteImage(id) {
        return axios__default['default'].delete(API_URL + "/" + id);
    }
    function updateImage(id, data) {
        return axios__default['default'].post(API_URL + "/" + id, data, {
            headers: {
                "content-type": "multipart/form-data",
            },
        });
    }

    function AddImage({ onAdd = () => { }, onImgPick }) {
        const fileInputRef = React__default['default'].useRef(null);
        const [isSuccess, setIsSuccess] = React__default['default'].useState(false);
        const [error, setError] = React__default['default'].useState(false);
        const [isPending, setIsPending] = React__default['default'].useState(false);
        React__default['default'].useEffect(() => {
            if (isSuccess) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }, [isSuccess, fileInputRef]);
        return (React__default['default'].createElement("form", { autoComplete: "off", className: "TheliaLibrary-AddImage", onSubmit: (e) => {
                e.preventDefault();
                setIsPending(true);
                setIsSuccess(false);
                setError(false);
                const data = new FormData(e.currentTarget);
                if (!data.has("locale")) {
                    data.set("locale", CURRENT_LOCAL);
                }
                createImage(data)
                    .then((response) => {
                    setIsSuccess(true);
                    onAdd(response);
                })
                    .catch((e) => setError(e.message))
                    .finally(() => {
                    setIsPending(false);
                });
            } },
            React__default['default'].createElement("div", { className: "form-group" },
                React__default['default'].createElement("div", { className: "TheliaLibrary-AddTitle" },
                    React__default['default'].createElement("div", null,
                        React__default['default'].createElement("label", { className: "custom-file-upload control-label" },
                            React__default['default'].createElement("input", { type: "file", name: "image", ref: fileInputRef, className: "form-control input-chose-img", onChange: (e) => { onImgPick(e); } }),
                            "Choisir une Image")),
                    React__default['default'].createElement("div", null,
                        React__default['default'].createElement("label", { htmlFor: "title", className: "inline control-label" }),
                        React__default['default'].createElement("input", { type: "text", name: "title", className: "inline text-left form-control input-chose-title", placeholder: "Titre de l'image" })))),
            React__default['default'].createElement("button", { type: "submit", disabled: isPending, className: "form-submit-button btn btn-sm btn-success" }, "Ajouter l'image"),
            isSuccess ? React__default['default'].createElement("div", null, "Ajout avec succ\u00E8s") : null,
            error ? React__default['default'].createElement("div", null, error) : null));
    }

    function ArrayQuery({ query, idQuery }) {
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-ArrayQuery" }));
    }

    function EditImage({ id, title, url, fileName, setIsEditing = () => { }, onEdit = () => { },
    //setItemArray = () => {},
     }) {
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
        return (React__default['default'].createElement("form", { autoComplete: "off", className: "TheliaLibrary-EditImage", onSubmit: (e) => {
                e.preventDefault();
                setIsPending(true);
                setIsSuccess(false);
                setError(false);
                const data = new FormData(e.currentTarget);
                if (!data.has("locale")) {
                    data.set("locale", CURRENT_LOCAL);
                }
                updateImage(id, data)
                    .then((response) => {
                    setIsSuccess(true);
                    onEdit(response);
                    setIsEditing(false);
                })
                    .catch((e) => setError(e.message))
                    .finally(() => {
                    setIsPending(false);
                });
            } },
            React__default['default'].createElement("div", { className: "text-center" },
                React__default['default'].createElement("a", { className: "view-update-img", onClick: () => {
                        setIsEditing(false);
                    } },
                    React__default['default'].createElement("img", { src: url })),
                React__default['default'].createElement("label", { className: "custom-file-upload" },
                    React__default['default'].createElement("input", { type: "file", name: "image", ref: fileInputRef, className: "form-control input-chose-img" }),
                    "Choisir une Image"),
                React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail-title" },
                    React__default['default'].createElement("label", { htmlFor: "title", className: "control-label" }, "Titre de l'image"),
                    React__default['default'].createElement("input", { type: "text", name: "title", value: localTitle, className: "text-center form-control input-chose-title", onChange: (e) => setLocalTitle(e.target.value) })),
                React__default['default'].createElement("button", { type: "submit", disabled: isPending, className: "form-submit-button btn btn-sm btn-success" }, "Modifier l'image"),
                isSuccess ? React__default['default'].createElement("div", null, "Ajout avec succ\u00E8s") : null,
                error ? React__default['default'].createElement("div", null, error) : null)));
    }

    function ImageView({ id, title, url, fileName, setIsEditing = () => { } }) {
        const fileInputRef = React__default['default'].useRef(null);
        const [isSuccess, setIsSuccess] = React__default['default'].useState(false);
        React__default['default'].useState(false);
        React__default['default'].useState(false);
        React__default['default'].useEffect(() => {
            if (isSuccess) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }, [isSuccess, fileInputRef]);
        return (React__default['default'].createElement("div", null,
            React__default['default'].createElement("a", { className: "link-update-img", onClick: () => {
                    setIsEditing(true);
                } },
                React__default['default'].createElement("img", { src: url }),
                React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail-title" }, id + " - " + (title ? title : "")))));
    }

    function Thumbnail({ id, url, title, fileName, onDelete = () => { }, onEdit = () => { }, }) {
        const [isEditing, setIsEditing] = React__default['default'].useState(false);
        if (!url)
            return null;
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-Thumbnail" }, isEditing ? (React__default['default'].createElement("div", { className: "text-center" },
            React__default['default'].createElement(EditImage, { id: id, title: title, url: url, fileName: fileName, setIsEditing: () => {
                    setIsEditing(false);
                }, onEdit: (response) => { onEdit(response); } }),
            React__default['default'].createElement("button", { className: "btn btn-danger btn-responsive supr-ThumbNail", onClick: () => {
                    if (window.confirm("etes vous sur ?")) {
                        deleteImage(id).then(() => onDelete());
                    }
                } },
                React__default['default'].createElement("i", { className: "glyphicon glyphicon-edit" }),
                React__default['default'].createElement("span", null, "Supprimer")))) : (React__default['default'].createElement("div", { className: "text-center" },
            React__default['default'].createElement(ImageView, { id: id, title: title, url: url, fileName: fileName, setIsEditing: () => {
                    setIsEditing(true);
                } }),
            React__default['default'].createElement("button", { className: "btn btn-danger btn-responsive supr-ThumbNail", onClick: () => {
                    if (window.confirm("etes vous sur ?")) {
                        deleteImage(id).then(() => onDelete());
                    }
                } },
                React__default['default'].createElement("i", { className: "glyphicon glyphicon-edit" }),
                React__default['default'].createElement("span", null, "Supprimer"))))));
    }

    function Grid({ limit, offset, data, loading, error, fetch }) {
        const [arrayImages, setArrayImages] = React.useState([]);
        React.useEffect(() => {
            setArrayImages(data);
        }, [data]);
        if (error) {
            return React__default['default'].createElement("div", null, error);
        }
        if (loading) {
            return React__default['default'].createElement("div", null, "loading");
        }
        function pushToArray(item) {
            if (!Array.isArray(arrayImages)) {
                return;
            }
            let tempArr = arrayImages.map((itemFromArray, index) => {
                if (item !== null) {
                    if (item.id === itemFromArray.id) {
                        return item;
                    }
                    return itemFromArray;
                }
            });
            setArrayImages(tempArr);
        }
        return (React__default['default'].createElement("div", { className: "TheliaLibrary-grid" }, arrayImages?.map((item) => {
            return (React__default['default'].createElement(Thumbnail, { ...item, onEdit: (response) => { pushToArray(response.data); }, onDelete: () => fetch() }));
        })));
    }

    // hooks
    function useAllImages(offset = 1, limit) {
        const [data, setData] = React__default['default'].useState(null);
        const [loading, setLoading] = React__default['default'].useState(false);
        const [error, setError] = React__default['default'].useState(null);
        const fetch = (offset, limit) => {
            setLoading(true);
            getAllImages({ locale: CURRENT_LOCAL, offset, limit })
                .then((response) => {
                setData(response.data);
            })
                .catch((e) => setError(e.message))
                .finally(() => {
                setLoading(false);
            });
        };
        React__default['default'].useEffect(() => {
            fetch(offset, limit);
        }, [offset, limit]);
        return {
            fetch,
            data,
            loading,
            error,
        };
    }
    function App() {
        const imgPreview = React__default['default'].useRef(null);
        const [offset, setOffset] = React__default['default'].useState(0);
        const [limit, setLimit] = React__default['default'].useState(24);
        const { data, loading, error, fetch } = useAllImages(offset, limit);
        function handlePreview(cible) {
            if (imgPreview.current) {
                if (cible.target.files.length > 0) {
                    var reader = new FileReader();
                    reader.onload = (function (aImg) {
                        return function (e) {
                            console.log(e);
                            if (aImg.current) {
                                aImg.current.src = e.target.result;
                            }
                        };
                    })(imgPreview);
                    reader.readAsDataURL(cible.target.files[0]);
                }
            }
            //document.querySelector("#img-preview").file = cible.target.files[0];
        }
        return (React__default['default'].createElement("div", { className: "bg-red-100" },
            React__default['default'].createElement("div", { className: "Settings" },
                React__default['default'].createElement("div", { className: "" },
                    React__default['default'].createElement("span", null, "Ajouter une Image"),
                    React__default['default'].createElement(AddImage, { onAdd: () => fetch(), onImgPick: (e) => handlePreview(e) })),
                React__default['default'].createElement("div", { className: "" },
                    React__default['default'].createElement("span", null, "Visualisation"),
                    React__default['default'].createElement("div", { className: "TheliaLibrary-ImgPreview" },
                        React__default['default'].createElement("img", { className: "img-preview", ref: imgPreview, src: "" }))),
                React__default['default'].createElement("div", { className: "" },
                    React__default['default'].createElement("span", null, "Recherche par ID et par Titre"),
                    React__default['default'].createElement(ArrayQuery, { query: "", idQuery: 0 }))),
            React__default['default'].createElement(Grid, { limit: limit, offset: offset, fetch: fetch, data: data, loading: loading, error: error }),
            React__default['default'].createElement("div", null,
                React__default['default'].createElement("button", { disabled: limit > offset, onClick: () => {
                        setOffset(offset - limit);
                    } },
                    React__default['default'].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
                        React__default['default'].createElement("path", { "fill-rule": "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", "clip-rule": "evenodd" }))),
                React__default['default'].createElement("button", { disabled: Array.isArray(data) && data?.length < limit, onClick: () => {
                        setOffset(offset + limit);
                    } },
                    React__default['default'].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
                        React__default['default'].createElement("path", { "fill-rule": "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", "clip-rule": "evenodd" }))))));
    }

    exports.App = App;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
function deleteImage(id) {
    return axios.delete(API_URL + "/" + id);
}
function updateImage(id, data) {
    return axios.post(API_URL + "/" + id, data, {
        headers: {
            "content-type": "multipart/form-data",
        },
    });
}

function AddImage({ onAdd = () => { }, onImgPick }) {
    const fileInputRef = React.useRef(null);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);
    React.useEffect(() => {
        if (isSuccess) {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [isSuccess, fileInputRef]);
    return (React.createElement("form", { autoComplete: "off", className: "TheliaLibrary-AddImage", onSubmit: (e) => {
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
        React.createElement("div", { className: "form-group" },
            React.createElement("div", { className: "TheliaLibrary-AddTitle" },
                React.createElement("div", null,
                    React.createElement("label", { className: "custom-file-upload control-label" },
                        React.createElement("input", { type: "file", name: "image", ref: fileInputRef, className: "form-control input-chose-img", onChange: (e) => { onImgPick(e); } }),
                        "Choisir une Image")),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "title", className: "inline control-label" }),
                    React.createElement("input", { type: "text", name: "title", className: "inline text-left form-control input-chose-title", placeholder: "Titre de l'image" })))),
        React.createElement("button", { type: "submit", disabled: isPending, className: "form-submit-button btn btn-sm btn-success" }, "Ajouter l'image"),
        isSuccess ? React.createElement("div", null, "Ajout avec succ\u00E8s") : null,
        error ? React.createElement("div", null, error) : null));
}

function ArrayQuery({ query, idQuery }) {
    return (React.createElement("div", { className: "TheliaLibrary-ArrayQuery" }));
}

function EditImage({ id, title, url, fileName, setIsEditing = () => { }, onEdit = () => { },
//setItemArray = () => {},
 }) {
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
    return (React.createElement("form", { autoComplete: "off", className: "TheliaLibrary-EditImage", onSubmit: (e) => {
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
        React.createElement("div", { className: "text-center" },
            React.createElement("a", { className: "view-update-img", onClick: () => {
                    setIsEditing(false);
                } },
                React.createElement("img", { src: url })),
            React.createElement("label", { className: "custom-file-upload" },
                React.createElement("input", { type: "file", name: "image", ref: fileInputRef, className: "form-control input-chose-img" }),
                "Choisir une Image"),
            React.createElement("div", { className: "TheliaLibrary-Thumbnail-title" },
                React.createElement("label", { htmlFor: "title", className: "control-label" }, "Titre de l'image"),
                React.createElement("input", { type: "text", name: "title", value: localTitle, className: "text-center form-control input-chose-title", onChange: (e) => setLocalTitle(e.target.value) })),
            React.createElement("button", { type: "submit", disabled: isPending, className: "form-submit-button btn btn-sm btn-success" }, "Modifier l'image"),
            isSuccess ? React.createElement("div", null, "Ajout avec succ\u00E8s") : null,
            error ? React.createElement("div", null, error) : null)));
}

function ImageView({ id, title, url, fileName, setIsEditing = () => { } }) {
    const fileInputRef = React.useRef(null);
    const [isSuccess, setIsSuccess] = React.useState(false);
    React.useState(false);
    React.useState(false);
    React.useEffect(() => {
        if (isSuccess) {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [isSuccess, fileInputRef]);
    return (React.createElement("div", null,
        React.createElement("a", { className: "link-update-img", onClick: () => {
                setIsEditing(true);
            } },
            React.createElement("img", { src: url }),
            React.createElement("div", { className: "TheliaLibrary-Thumbnail-title" }, id + " - " + (title ? title : "")))));
}

function Thumbnail({ id, url, title, fileName, onDelete = () => { }, onEdit = () => { }, }) {
    const [isEditing, setIsEditing] = React.useState(false);
    if (!url)
        return null;
    return (React.createElement("div", { className: "TheliaLibrary-Thumbnail" }, isEditing ? (React.createElement("div", { className: "text-center" },
        React.createElement(EditImage, { id: id, title: title, url: url, fileName: fileName, setIsEditing: () => {
                setIsEditing(false);
            }, onEdit: (response) => { onEdit(response); } }),
        React.createElement("button", { className: "btn btn-danger btn-responsive supr-ThumbNail", onClick: () => {
                if (window.confirm("etes vous sur ?")) {
                    deleteImage(id).then(() => onDelete());
                }
            } },
            React.createElement("i", { className: "glyphicon glyphicon-edit" }),
            React.createElement("span", null, "Supprimer")))) : (React.createElement("div", { className: "text-center" },
        React.createElement(ImageView, { id: id, title: title, url: url, fileName: fileName, setIsEditing: () => {
                setIsEditing(true);
            } }),
        React.createElement("button", { className: "btn btn-danger btn-responsive supr-ThumbNail", onClick: () => {
                if (window.confirm("etes vous sur ?")) {
                    deleteImage(id).then(() => onDelete());
                }
            } },
            React.createElement("i", { className: "glyphicon glyphicon-edit" }),
            React.createElement("span", null, "Supprimer"))))));
}

function Grid({ limit, offset, data, loading, error, fetch }) {
    const [arrayImages, setArrayImages] = useState([]);
    useEffect(() => {
        setArrayImages(data);
    }, [data]);
    if (error) {
        return React.createElement("div", null, error);
    }
    if (loading) {
        return React.createElement("div", null, "loading");
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
    return (React.createElement("div", { className: "TheliaLibrary-grid" }, arrayImages?.map((item) => {
        return (React.createElement(Thumbnail, { ...item, onEdit: (response) => { pushToArray(response.data); }, onDelete: () => fetch() }));
    })));
}

// hooks
function useAllImages(offset = 1, limit) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
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
    React.useEffect(() => {
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
    const imgPreview = React.useRef(null);
    const [offset, setOffset] = React.useState(0);
    const [limit, setLimit] = React.useState(24);
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
    return (React.createElement("div", { className: "bg-red-100" },
        React.createElement("div", { className: "Settings" },
            React.createElement("div", { className: "" },
                React.createElement("span", null, "Ajouter une Image"),
                React.createElement(AddImage, { onAdd: () => fetch(), onImgPick: (e) => handlePreview(e) })),
            React.createElement("div", { className: "" },
                React.createElement("span", null, "Visualisation"),
                React.createElement("div", { className: "TheliaLibrary-ImgPreview" },
                    React.createElement("img", { className: "img-preview", ref: imgPreview, src: "" }))),
            React.createElement("div", { className: "" },
                React.createElement("span", null, "Recherche par ID et par Titre"),
                React.createElement(ArrayQuery, { query: "", idQuery: 0 }))),
        React.createElement(Grid, { limit: limit, offset: offset, fetch: fetch, data: data, loading: loading, error: error }),
        React.createElement("div", null,
            React.createElement("button", { disabled: limit > offset, onClick: () => {
                    setOffset(offset - limit);
                } },
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
                    React.createElement("path", { "fill-rule": "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", "clip-rule": "evenodd" }))),
            React.createElement("button", { disabled: Array.isArray(data) && data?.length < limit, onClick: () => {
                    setOffset(offset + limit);
                } },
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
                    React.createElement("path", { "fill-rule": "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", "clip-rule": "evenodd" }))))));
}

export { App };

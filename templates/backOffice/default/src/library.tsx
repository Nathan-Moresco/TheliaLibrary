import "./styles.css";

import React, { useRef, useState } from "react";

import { CURRENT_LOCAL } from "./constants";
import Grid from "./components/Grid";
import Image from "./components/Image";
import ManageDetails from "./components/ManageDetails";
import ManageImage from "./components/ManageImage";
import { getAllImages } from "./api";

export type ImageQuery = {
  offset: number;
  limit: number;
  title: string;
};

export type ImageItem = {
  id: number | "new";
  title: string;
  url: string;
};

// hooks
function useAllImages({ offset = 1, limit = 24, title = "" }: ImageQuery) {
  const [data, setData] = React.useState<ImageItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetch = (offset?: number, limit?: number, title?: string) => {
    setLoading(true);
    getAllImages({ locale: CURRENT_LOCAL, offset, limit, title })
      .then((response) => {
        setData(response.data as any);
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

export function App() {
  const titlePreview = useRef<HTMLSpanElement>(null);
  const [activeItem, setActiveItem] = React.useState<ImageItem | null>(null);
  const [unEditedSrc, setUneditedSrc] = React.useState("");

  const [images, setImages] = useState<ImageItem[]>([]);

  const [title, setTitle] = React.useState("");
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(24);

  const { data, loading, error } = useAllImages({ title, offset, limit });

  React.useEffect(() => {
    setImages(data);
  }, [data]);

  React.useEffect(() => {
    if(activeItem){
      if(titlePreview.current){
        titlePreview.current.innerHTML = activeItem.title;
      }
    }
  })
  //Grid Array
  function prependImage(item: ImageItem) {
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
    } else {
      tempArr.push(item);
    }

    setImages(tempArr);
  }

  function deleteImage(id: ImageItem["id"]) {
    if (!Array.isArray(images)) {
      return;
    }
    let tempArr = images.filter((image) => {
      return id !== image.id;
    });
    setImages(tempArr);
  }

  return (
    <div className="bg-red-100">
      <div className="Settings">
        <div className="col-span-5 Settings-Title">
          <span>Espace Edition</span>
        </div>
        <div className="col-span-2 Settings-Title">
          <span>Visualisation</span>
        </div>
        <div className="col-span-5">
          <div className="TheliaLibrary-EditImage">
            <ManageImage
              src={unEditedSrc}
              item={activeItem}
              onModifyImage={(item: ImageItem) => setActiveItem(item)}
            />

            <ManageDetails
              item={activeItem}
              onTitleChange={(item: ImageItem) => setActiveItem(item)}
              onPickImage={(item: ImageItem) => {
                setActiveItem(item);
                setUneditedSrc(item.url);
              }}
              prependImage={(item) => prependImage(item)}
              reset={() => {
                setActiveItem(null);
                setUneditedSrc("");
              }}
            />
          </div>
        </div>
        <div className="col-span-2">
          <div className="TheliaLibrary-ImgPreview">
            <div>
              <Image classes="img-preview" src={activeItem?.url || ""} />
            </div>
            <span className="title-preview" ref={titlePreview}></span>
          </div>
        </div>
      </div>
      <div className="line-grid-actions">
        <button
          className="btn-page-previous"
          disabled={limit > offset}
          onClick={() => {
            setOffset(offset - limit);
          }}
        >
          {" "}
          <i className="glyphicon glyphicon-chevron-left"></i>{" "}
        </button>
        <button
          className="btn-page-next"
          disabled={Array.isArray(images) && images?.length < limit}
          onClick={() => {
            setOffset(offset + limit);
          }}
        >
          {" "}
          <i className="glyphicon glyphicon-chevron-right"></i>{" "}
        </button>
        <span className="page-Indicator">
          Page <b>{offset / limit + 1}</b>
        </span>
        <span className="line-number">
          {" "}
          Nombre de Lignes{" "}
          <input
            className="line-number-input"
            type="number"
            min="1"
            onChange={(e) => setLimit(parseInt(e.target.value) * 8)}
          />
        </span>
        <span className="nb-products">
          {" "}
          Nombre d'images : {images ? images.length : 0}
        </span>
        <button
          className="all-products"
          onClick={() => {
            if (
              window.confirm(
                "Si tous les produits sont chargés, il se peut que votre navigateur soit bloqué. Continuer ?"
              )
            ) {
              setLimit(9999);
            }
          }}
        >
          Afficher toutes les Images
        </button>
        <input
          type="text"
          value={title}
          className="inline text-left form-control input-chose-title query-title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Recherche par Titre"
        />
      </div>
      <Grid
        images={images}
        loading={loading}
        error={error}
        setImgEditing={(image: ImageItem) => {
          setActiveItem(image);
          setUneditedSrc(image.url);
        }}
        onDelete={deleteImage}
      />
    </div>
  );
}

import { createImage, updateImage } from "../api";

import { CURRENT_LOCAL } from "../constants";
import { ImageItem } from "../library";
import React from "react";

export type ManageDetailsProps = {
  item: ImageItem | null;
  prependImage: (image: ImageItem) => void;
  onPickImage: (image: ImageItem) => void;
  reset: () => void;
};

function toBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function urltoFile(url: string, filename: string, mimeType: string) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

export default function ManageDetails({
  item,
  prependImage,
  onPickImage,
  reset,
}: ManageDetailsProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [localTitle, setLocalTitle] = React.useState("");

  React.useEffect(() => {
    if (isSuccess && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isSuccess, fileInputRef]);

  React.useEffect(() => {
    if (item?.title) {
      setLocalTitle(item.title);
    }
  }, [item, setLocalTitle]);

  React.useEffect(() => {
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

  return (
    <div>
      <form
        autoComplete="off"
        className="TheliaLibrary-ImagePreview"
        onSubmit={async (e) => {
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
          } else if (item?.id) {
            updateImage(item.id, data)
              .then((response) => {
                setIsSuccess(true);
                reset();
              })
              .catch((e) => setError(e.message))
              .finally(() => {
                setIsPending(false);
              });
          }
        }}
      >
        <div className="text-center">
          <label className="custom-file-upload">
            <input
              type="file"
              name="image"
              ref={fileInputRef}
              className="form-control input-chose-img"
              onChange={(e) => {
                setFiles(e.target.files);
              }}
            />
            Choisir une Image
          </label>

          <div className="TheliaLibrary-Thumbnail-title">
            <label htmlFor="title" className="control-label">
              Titre de l'image
            </label>
            <input
              type="text"
              name="title"
              value={localTitle}
              className="text-center form-control input-chose-title"
              onChange={(e) => {
                setLocalTitle(e.target.value);
                //onTitleChange(e.target.value);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!item?.url || isPending}
            className="form-submit-button btn-green"
          >
            Valider Image
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
            }}
            className="btn-red"
          >
            Annuler
          </button>

          {isSuccess ? <div className="success-msg">Succes</div> : null}
          {error ? (
            <div className="error-msg">
              {console.log(error)} Echec, veuillez recommencer
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}

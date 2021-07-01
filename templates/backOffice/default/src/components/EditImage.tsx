import { CURRENT_LOCAL } from "../constants";
import React from "react";
import { updateImage } from "../api";

export type EditImageProps = {
  id: number;
  title: string;
  url: string;
  fileName: string;
  setIsEditing: Function;
  onEdit: Function;
  //setItemArray: Function;
};

export default function EditImage({
  id,
  title,
  url,
  fileName,
  setIsEditing = () => {},
  onEdit = () => {},
  //setItemArray = () => {},
}: EditImageProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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

  return (
    <form
      autoComplete="off"
      className="TheliaLibrary-EditImage"
      onSubmit={(e) => {
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
      }}
    >
      
      <div className="text-center">
        <a className="view-update-img"
          onClick={() => {
          setIsEditing(false);
          }}
        >
          <img src={url}/>
        </a>

        <label className="custom-file-upload">
          <input type="file"
            name="image"
            ref={fileInputRef}
            className="form-control input-chose-img"
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
            onChange={(e) => setLocalTitle(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={isPending}
          className="form-submit-button btn btn-sm btn-success"
        >
          Modifier l'image
        </button>
      {isSuccess ? <div>Ajout avec succès</div> : null}
      {error ? <div>{error}</div> : null}
      </div>
    </form>
  );
}

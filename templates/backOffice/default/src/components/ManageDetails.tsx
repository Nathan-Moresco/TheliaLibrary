import { CURRENT_LOCAL } from "../constants";
import React from "react";
import { updateImage, createImage } from "../api";

export type ManageDetailsProps = {
  id: number;
  title: string;
  croppedFile: { lastModified: number; lastModifiedDate: null; name: string; size: number; type: string; webkitRelativePath: string; };
  onAdd: Function;
  onEdit: Function;
  onImgPick: Function;
  onTitleChange: Function;
  emptyPreview: Function;
};

export default function ManageDetails({
  id,
  title,
  croppedFile,
  onAdd,
  onEdit,
  onImgPick,
  onTitleChange,
  emptyPreview,
}: ManageDetailsProps) {
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
    <div>
      <form
        autoComplete="off"
        className="TheliaLibrary-ImagePreview"
        onSubmit={(e) => {
          e.preventDefault();
          setIsPending(true);
          setIsSuccess(false);
          setError(false);
          const data = new FormData(e.currentTarget);
          if (!data.has("locale")) {
            data.set("locale", CURRENT_LOCAL);
          }
          if(croppedFile){
            data.set("image", croppedFile, "cropped.png");
          }
          if(id === 0){
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
          } else {
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
        }}
      >
        
        <div className="text-center">
          <label className="custom-file-upload">
            <input type="file"
              name="image"
              ref={fileInputRef}
              className="form-control input-chose-img"
              onChange={(e) => { onImgPick(e, id, title)}}
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
                onTitleChange(e.target.value);
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="form-submit-button btn-green"
          > Valider Image </button>

          <button
            type="button"
            onClick={() => emptyPreview()}
            className="btn-red"
          > Fermer </button>

          {isSuccess ? <div className="success-msg">Succes</div> : null}
          {error ? <div className="error-msg">{console.log(error)} Echec, veuillez recommencer</div> : null}
        </div>
      </form>
    </div>
    
  );
}

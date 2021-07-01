import EditImage from "./EditImage";
import ImageView from "./ImageView";
import React from "react";
import { deleteImage } from "../api";

export type ThumbnailProps = {
  id: number;
  url: string;
  title: string;
  fileName: string;
  onDelete: Function;
  onEdit: Function;
};
export default function Thumbnail({
  id,
  url,
  title,
  fileName,
  onDelete = () => {},
  onEdit = () => {},
}: ThumbnailProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  if (!url) return null;

  return (
    <div className="TheliaLibrary-Thumbnail">
      {isEditing ? (
        <div className="text-center">
          <EditImage
            id={id}
            title={title}
            url={url}
            fileName={fileName}
            setIsEditing={() => {
              setIsEditing(false);
            }}
            onEdit={(response) => { onEdit(response) }}
          />
          <button
            className="btn btn-danger btn-responsive supr-ThumbNail"
            onClick={() => {
              if (window.confirm("etes vous sur ?")) {
                deleteImage(id).then(() => onDelete());
              }
            }}
          >
            <i className="glyphicon glyphicon-edit"></i>
            <span>Supprimer</span>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <ImageView
            id={id}
            title={title}
            url={url}
            fileName={fileName}
            setIsEditing={() => {
              setIsEditing(true);
            }}
          />
          <button
            className="btn btn-danger btn-responsive supr-ThumbNail"
            onClick={() => {
              if (window.confirm("etes vous sur ?")) {
                deleteImage(id).then(() => onDelete());
              }
            }}
          >
            <i className="glyphicon glyphicon-edit"></i>
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </div>
  );
}

import ImageView from "./ImageView";
import React from "react";
import { deleteImage } from "../api";

export type ThumbnailProps = {
  id: number;
  url: string;
  title: string;
  onDelete: Function;
  setImgEditing: Function;
};
export default function Thumbnail({
  id,
  url,
  title,
  onDelete = () => {},
  setImgEditing,
}: ThumbnailProps) {

  if (!url) return null;

  return (
    <div className="TheliaLibrary-Thumbnail">
      <div className="text-center">
        <ImageView
          id={id}
          title={title}
          url={url}
          setImgEditing={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,id: number,title: string) => setImgEditing(e,id,title)}
        />
        <button
          className="btn-red"
          onClick={() => {
            if (window.confirm("Etes vous sur ?")) {
              deleteImage(id).then(() => onDelete(id));
            }
          }}
        > <span> Supprimer</span> </button>
      </div>
    </div>
  );
}

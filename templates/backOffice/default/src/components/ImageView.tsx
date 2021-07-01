import { CURRENT_LOCAL } from "../constants";
import React from "react";
import { updateImage } from "../api";

export type ImageViewProps = {
  id: number;
  title: string;
  url: string;
  fileName: string;
  setIsEditing: Function;
};

export default function ImageView({ id,title,url,fileName,  setIsEditing = () => {} }: ImageViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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

  return (
    <div>
      <a className="link-update-img"
       onClick={() => {
          setIsEditing(true);
        }}
      >
        <img src={url} />
        <div className="TheliaLibrary-Thumbnail-title">
            {id + " - " + (title ? title : "")}
        </div>
      </a>
    </div>
  );
}

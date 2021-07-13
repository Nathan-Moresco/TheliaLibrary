import Image from "./Image";
import React from "react";

export type ImageViewProps = {
  id: number;
  title: string;
  url: string;
  setImgEditing: Function;
};

export default function ImageView({
  id,
  title,
  url,
  setImgEditing = () => {},
}: ImageViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isSuccess) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isSuccess, fileInputRef]);

  return (
    <div>
      <a
        className="link-update-img"
        onClick={(e) => {
          setImgEditing(e, { id, title, url });
        }}
      >
        <Image classes="" src={url} />
        <div className="TheliaLibrary-Thumbnail-Complete-title">
          {id} -{" "}
          <b className="TheliaLibrary-Thumbnail-title">{title ? title : ""}</b>
        </div>
      </a>
    </div>
  );
}

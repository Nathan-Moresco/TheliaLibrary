import React, { useEffect } from "react";

import { ImageItem } from "../library";
import Thumbnail from "./Thumbnail";

// Components
export type GridProps = {
  loading: boolean;
  error: string | null;
  images: ImageItem[];
  onDelete: (id: number) => void;
  setImgEditing: (item: ImageItem) => void;
};

export default function Grid({
  loading,
  error,
  images,
  onDelete,
  setImgEditing,
}: GridProps) {
  if (error) {
    return <div className="error-msg"> {error} </div>;
  }
  if (loading) {
    return <div className="loading-msg"> Loading </div>;
  }

  return (
    <div className="TheliaLibrary-grid">
      {images.length >= 1 ? (
        images?.map((item: { id: number; url: string; title: string }) => {
          return (
            <Thumbnail
              {...item}
              key={item.id}
              onDelete={onDelete}
              setImgEditing={() => {
                setImgEditing(item);
              }}
            />
          );
        })
      ) : (
        <div className="TheliaLibrary-EmptyGrid">
          <span>Aucun Résultat</span>
        </div>
      )}
    </div>
  );
}

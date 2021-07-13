import React, { useEffect } from "react";
import Thumbnail from "./Thumbnail";
// Components
export type GridProps = {
  data: any;
  loading: boolean;
  error: string | null;
  arrayImages: Array<{
    id: number,
    title: string,
    url: string
  }>;
  setArrayImages: Function;
  setImgEditing: Function;
};

export default function Grid({
  data,
  loading,
  error,
  arrayImages,
  setArrayImages,
  setImgEditing
}: GridProps) {

  useEffect(() => {
    setArrayImages(data)
  },[data])

  if (error) {
    return <div className="error-msg"> {error} </div>;
  }
  if (loading) {
    return <div className="loading-msg"> Loading </div>;
  }

  function deleteFromArray(id: number){
    if (!Array.isArray(arrayImages)) {
      return
    }
    let tempArr = arrayImages.filter((itemFromArray) => {
      if(id !== null){
        if(id === itemFromArray.id){
          return false
        }
        return true
      }
    });
    setArrayImages(tempArr);
  }

  return (
    <div className="TheliaLibrary-grid">
      {(arrayImages.length >= 1) ? (
        arrayImages?.map((item: { id: number; url: string; title: string}) => {
          return (
            <Thumbnail
              {...item}
              key={item.id}
              onDelete={(id:number) => { deleteFromArray(id) }}
              setImgEditing={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id:number, title:string) => { setImgEditing(e, id, title) }}
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

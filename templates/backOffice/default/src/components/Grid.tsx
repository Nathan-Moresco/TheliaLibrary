import React, {useEffect, useState} from "react";
import Thumbnail from "./Thumbnail";
// Components
export type GridProps = {
  limit: number,
  offset: number,
  data: any;
  loading: boolean;
  error: string | null;
  fetch: Function;
};

export default function Grid({ limit, offset, data, loading, error, fetch }: GridProps) {
  const [arrayImages, setArrayImages] = useState<
    Array<{
      id: number,
      title: string,
      fileName: string,
      url: string
    }>
  >([])

  useEffect(() => {
    setArrayImages(data)
  },[data])

  if (error) {
    return <div>{error}</div>;
  }
  if (loading) {
    return <div>loading</div>;
  }

  function pushToArray(item: {id: number; url: string; title: string; fileName: string}){
    if (!Array.isArray(arrayImages)) {
      return
    }

    let tempArr = arrayImages.map((itemFromArray, index) => {
      if(item !== null){
        if(item.id === itemFromArray.id){
          return item;
        }
        return itemFromArray;
      }
    });
    setArrayImages(tempArr);
  }

  return (
    <div className="TheliaLibrary-grid">
      {arrayImages?.map((item: { id: number; url: string; title: string; fileName: string}) => {
        return (
          <Thumbnail {...item} onEdit={(response) => { pushToArray(response.data) }} onDelete={() => fetch()} />
        );
      })}
    </div>
  );
}

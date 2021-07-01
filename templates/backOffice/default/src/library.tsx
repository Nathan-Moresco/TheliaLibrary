import "./styles.css";

import AddImage from "./components/AddImage";
import ArrayQuery from "./components/ArrayQuery";
import { CURRENT_LOCAL } from "./constants";
import Grid from "./components/Grid";
import React, { useState } from "react";
import { getAllImages } from "./api";

// hooks
function useAllImages(offset = 1, limit: number) {
  const [data, setData] = React.useState<Record<string, any> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetch = (offset?: number, limit?: number) => {
    setLoading(true);
    getAllImages({ locale: CURRENT_LOCAL, offset, limit })
      .then((response) => {
        setData(response.data as any);
      })
      .catch((e) => setError(e.message))
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetch(offset, limit);
  }, [offset, limit]);

  return {
    fetch,
    data,
    loading,
    error,
  };
}

export function App() {
  const imgPreview = React.useRef<HTMLImageElement>(null);
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(24);
  const { data, loading, error, fetch } = useAllImages(offset, limit);

  function handlePreview(cible){
    if(imgPreview.current){
      if(cible.target.files.length > 0){
        var reader = new FileReader();
        reader.onload = (function(aImg) {
          return function(e) {
            console.log(e);
            if(aImg.current){
              aImg.current.src = e.target.result;
            }
          };
        })(imgPreview);
        reader.readAsDataURL(cible.target.files[0]);
      }
    }
    //document.querySelector("#img-preview").file = cible.target.files[0];
  }
  
  return (
    <div className="bg-red-100">
      <div className="Settings">
        <div className="">
          <span>Ajouter une Image</span>
          <AddImage onAdd={() => fetch()} onImgPick={(e) => handlePreview(e)}/>
        </div>
        <div className="">
          <span>Visualisation</span>
          <div className="TheliaLibrary-ImgPreview">
            <img className="img-preview" ref={imgPreview} src=""/>
          </div>
        </div>
        <div className="">
          <span>Recherche par ID et par Titre</span>

          <ArrayQuery query="" idQuery={0} />
        </div>
      </div>
      <Grid limit={limit} offset={offset} fetch={fetch} data={data} loading={loading} error={error} />
      <div>
        <button
          disabled={limit > offset}
          onClick={() => {
            setOffset(offset - limit);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          disabled={Array.isArray(data) && data?.length < limit}
          onClick={() => {
            setOffset(offset + limit);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

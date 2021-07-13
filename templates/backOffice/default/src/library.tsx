import "./styles.css";

import Image from "./components/Image";
import ManageImage from "./components/ManageImage";
import { CURRENT_LOCAL } from "./constants";
import Grid from "./components/Grid";
import React, { useState, useRef } from "react";

import { getAllImages } from "./api";

// hooks
function useAllImages(offset = 1, limit: number, title = "") {
  const [data, setData] = React.useState<Record<string, any> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetch = (offset?: number, limit?: number, title?: string) => {
    setLoading(true);
    getAllImages({ locale: CURRENT_LOCAL, offset, limit, title})
      .then((response) => {
        setData(response.data as any);
      })
      .catch((e) => setError(e.message))
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetch(offset, limit, title);
  }, [offset, limit, title]);

  return {
    fetch,
    data,
    loading,
    error,
  };
}

export function App() {
  const imgPreview = useRef<HTMLImageElement>(null);
  const titlePreview = useRef<HTMLSpanElement>(null);

  const [arrayImages, setArrayImages] = useState<
    Array<{
      id: number,
      title: string,
      url: string
    }>
  >([])

  const [selectedId, setSelectedId] = React.useState(0);
  const [selectedTitle, setSelectedTitle] = React.useState("img");
  const [selectedSrc, setSelectedSrc] = React.useState(""); //URL img Modal

  const [queryTitle, setQueryTitle] = React.useState("");
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(24);
  
  const { data, loading, error } = useAllImages(offset, limit, queryTitle);
  
  // Preview
  function managePreview(title: string, img: string){
    if(imgPreview.current){ //IMAGE
      if(selectedSrc === ""){
        imgPreview.current.src = ""; //DEFAULT IMG
      } else {
        if(!img){
          imgPreview.current.src = selectedSrc;
        } else {
          imgPreview.current.src = img;
        }
      }
    }

    if(titlePreview.current) { // TITRE
      titlePreview.current.innerHTML = "";
      if(selectedId == 0){
        if(data){
          if(data.length > 0){
            let newId = data[data.length-1].id+1;
            titlePreview.current.append(newId+ " - "+title);
          } else {
            titlePreview.current.append("1 - "+title);
          }
        } else {
          titlePreview.current.append("1 - "+title);
        }
      }
      else {
        titlePreview.current.append(selectedId + " - " + title);
      }
    }
  }
  function emptyPreview(){
    if(imgPreview.current){
      imgPreview.current.src = "";
    }
    if(titlePreview.current){
      titlePreview.current.innerHTML = "";
    }
    setSelectedId(0);
    setSelectedTitle("img");
    setSelectedSrc("");
  }
  
  //Image Changing
  function storeImg(cible: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id:number, title:string, imgCropped = ""){
    // 1 - Placer les paramètres dans les States (Image en cours d'Edition)
    // 2 - Lancer la Preview
    
    var img = "";

    setSelectedId(id);
    setSelectedTitle(title);

    if(cible){
      if(cible.target.src){ //Image déjà présente
        setSelectedSrc(cible.target.src);
        img = cible.target.src;
      } else if(cible.target.files.length){ //Image choisie avec Input
        var reader = new FileReader();
        reader.onload = (function(readerLoadedImgPreview) {
          return function(e) {
            if(readerLoadedImgPreview.current){
              readerLoadedImgPreview.current.src = e.target.result;
                setSelectedSrc(e.target.result);
                img = e.target.result;
            }
          };
          
        })(imgPreview);
        reader.readAsDataURL(cible.target.files[0]);
        
      } else {
        console.log("cible.target.src is null : ", cible);
      }
    } else {
      if(imgCropped){
        setSelectedSrc(imgCropped);
        img = imgCropped;
      }
    }
    
    managePreview(title, img);
  }

  //Grid Array
  function pushToArray(item: {id: number; url: string; title: string}){
    if (!Array.isArray(arrayImages)) {
      return
    }

    let tempArr = arrayImages.map((itemFromArray) => {
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
    <div className="bg-red-100">
      <div className="Settings">
        <div className="col-span-5 Settings-Title">
          <span>Espace Edition</span>
        </div>
        <div className="col-span-2 Settings-Title">
          <span>Visualisation</span>
        </div>
        <div className="col-span-5">
          <div className="TheliaLibrary-EditImage">
            <ManageImage id={selectedId} title={selectedTitle} src={selectedSrc}
              dynamicPush={(responseData) => {
                pushToArray(responseData);
              }}
              emptyPreview={() => emptyPreview()}
              storeImg={(e, id, title, image) => storeImg(e, id, title, image)}
              setImgPreview={(title, croppedImg) => {
                managePreview(title, croppedImg);
              }}
            />
          </div>
        </div>
        <div className="col-span-2">
          <div className="TheliaLibrary-ImgPreview">
            <div>
              <Image classes="img-preview" reff={imgPreview} src=""/>
            </div>
            <span className="title-preview" ref={titlePreview}></span>
          </div>
        </div>
      </div>
      <div className="line-grid-actions">
        <button
          className="btn-page-previous"
          disabled={limit > offset}
          onClick={() => {
            setOffset(offset - limit);
          }}
        > <i className="glyphicon glyphicon-chevron-left"></i> </button>
        <button
          className="btn-page-next"
          disabled={Array.isArray(data) && data?.length < limit}
          onClick={() => {
            setOffset(offset + limit);
          }}
        > <i className="glyphicon glyphicon-chevron-right"></i> </button>
        <span className="page-Indicator">Page <b>{(offset/limit)+1}</b></span>
        <span className="line-number"> Nombre de Lignes <input className="line-number-input" type="number" min="1" onChange={(e) => setLimit(e.target.value*8)}/></span>
        <span className="nb-products"> Nombre de Produits : {data ? data.length : 0}</span>
        <button className="all-products" onClick={() => {
          if (window.confirm("Si tous les produits sont chargés, il se peut que votre navigateur soit bloqué. Continuer ?")) {
            setLimit(9999);
          }
          }}>Afficher toutes les Images</button>
        <input
            type="text"
            value={queryTitle}
            className="inline text-left form-control input-chose-title query-title"
            onChange={(e) => {
                setQueryTitle(e.target.value);
            }}
            placeholder="Recherche par Titre"
        />
      </div>
      <Grid
        arrayImages={arrayImages}
        setArrayImages={(array: { id: number; title: string; url: string; }[]) => setArrayImages(array)}
        data={data}
        loading={loading}
        error={error}
        setImgEditing={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id:number, title:string) => {
          emptyPreview();
          storeImg(e, id, title);
        }}
      />
    </div>
  );
}

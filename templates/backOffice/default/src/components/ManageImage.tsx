import React, { Ref, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";

import { AxiosResponse } from "axios";
import { ImageItem } from "../library";
import ManageDetails from "./ManageDetails";

export type ManageImageProps = {
  src: string;
  item: ImageItem | null;
  onModifyImage: Function;
};

function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
): Promise<Blob> {
  const canvas: HTMLCanvasElement = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width || 0;
  canvas.height = crop.height || 0;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.reject("erreur: pas de canvas context");
  }

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return Promise.reject("erreur: conversion en blob impossible");
        }

        blob.name = fileName;
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
}

export default function ManageImage({ src, item, onModifyImage }: ManageImageProps) {
  const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  function onCropComplete(crop: Crop) {
    if (imageRef) {
      getCroppedImg(imageRef, crop, item.title).then((blob) => {
        onModifyImage({
          id: item.id || "new",
          url: URL.createObjectURL(blob),
          title: item.title,
        });
      });
    }
  }

  return (
    <div className="TheliaLibrary-ManageImage">
      <div className="col-span-3 Cropper-Block">
        {item && src && (
          <ReactCrop
            src={src}
            crop={crop}
            locked={false}
            ruleOfThirds
            onImageLoaded={(image) => {
              setCrop({
                unit: "px",
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
              });
              setImageRef(image);
              return false;
            }}
            onComplete={onCropComplete}
            onChange={setCrop}
          />
        )}
      </div>
    </div>
  );
}

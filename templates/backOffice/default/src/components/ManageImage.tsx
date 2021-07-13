import { AxiosResponse } from "axios";

import React, { useState, useRef } from "react";
import ReactCrop from 'react-image-crop';
import ManageDetails from "./ManageDetails";

export type ManageImageProps = {
    id: number;
    title: string;
    src: string;
    dynamicPush:Function;
    emptyPreview: Function;
    setImgPreview: Function;
    storeImg: Function;
};

export default function ManageImage({ id, title, src, dynamicPush, setImgPreview, emptyPreview, storeImg}: ManageImageProps) {
    const [croppedImageUrl, setCroppedImageUrl] = useState(src);
    const [croppedImage, setCroppedImage] = useState({lastModified: 0, lastModifiedDate: null, name: "", size: 0, type: "", webkitRelativePath: ""});
    const imageRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });
    
    function validCrop(useCrop: { unit: string; width: number; height: number; x: number; y: number; }){
        if(useCrop.height === 0){
            if(useCrop.width === 0){
                return false;
            }
            return false;
        }
        return true;
    }

    function onCropChange(newCrop: { unit: string; width: number; height: number; x: number; y: number; }, percentCrop: { unit: string; width: number; height: number; x: number; y: number; }){
        if(isNaN(percentCrop.x)){
            percentCrop.x = 0;
        }
        if(isNaN(percentCrop.y)){
            percentCrop.y = 0;
        }
        if(validCrop(percentCrop)){
            setCrop(percentCrop);
        }
    }

    function onCropComplete(newCrop: { unit: string; width: number; height: number; x: number; y: number; }){
        if(validCrop(newCrop)){
            getCroppedImg(imageRef.current, newCrop);
        }
    }
    
    //: React.RefObject<HTMLImageElement>
    function getCroppedImg(image, usedCrop: { unit: string; width: number; height: number; x: number; y: number; }) {
        if(image){
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = usedCrop.width;
            canvas.height = usedCrop.height;
            const ctx = canvas.getContext('2d');
        
            if(ctx){
                ctx.drawImage(
                    image,
                    usedCrop.x * scaleX,
                    usedCrop.y * scaleY,
                    usedCrop.width * scaleX,
                    usedCrop.height * scaleY,
                    0,
                    0,
                    usedCrop.width,
                    usedCrop.height
                );
            }
            
            const reader = new FileReader();
            canvas.toBlob(blob => {
                reader.readAsDataURL(blob)
                reader.onloadend = () => {
                    setCroppedImageUrl(reader.result);
                    dataURLtoFile(reader.result, 'cropped.jpg');
                    setImgPreview(title, reader.result);
                }
            })
        }
    }

    function dataURLtoFile(dataurl: string | ArrayBuffer | null, filename: string) {
        if(dataurl){
            let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
                    
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            let croppedImage = new File([u8arr], filename, {type:mime});
            setCroppedImage(croppedImage);
        }
    }

    return (
        <div className="TheliaLibrary-Edit-Image-Content">
            <div className="col-span-3 Cropper-Block">
                
                <img src={src} ref={imageRef} className="display-none"/>
                {src && (
                    <ReactCrop
                        src={src}
                        crop={crop}
                        locked={false}
                        ruleOfThirds
                        onComplete={(completedCrop) => onCropComplete(completedCrop)}
                        onChange={(changedCrop, percentCrop) => {onCropChange(changedCrop, percentCrop)}}
                    />
                )}
            </div>
            <div className="col-span-1 Edit-Details-Block">
                <button type="button"
                    className="RefreshCrop-Btn"
                    onClick={() => setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 })}
                > Ø </button>
                <ManageDetails
                    id={id}
                    title={title}
                    croppedFile={croppedImage}
                    onAdd={(response: AxiosResponse<any>) => {
                        dynamicPush(response);
                    }}
                    onEdit={(response: AxiosResponse<any>) => {
                        dynamicPush(response);
                    }}
                    onImgPick={(e: React.ChangeEvent<HTMLInputElement>, id:number, title:string) => {
                        emptyPreview();
                        storeImg(e, id, title);
                    }}
                    onTitleChange={(newTitle: string) => {
                        storeImg(null, id, newTitle, src);
                        if(croppedImageUrl){
                            setImgPreview(newTitle, croppedImageUrl);
                        }
                    }}
                    emptyPreview={() => emptyPreview()}
                />
            </div>
        </div>
    );
}

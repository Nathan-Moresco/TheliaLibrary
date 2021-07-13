/// <reference types="react" />
declare module "api" {
    export function getAllImages(params: Record<string, any>): Promise<import("axios").AxiosResponse<any>>;
    export function createImage(data: FormData): Promise<import("axios").AxiosResponse<any>>;
    export function updateImage(id: number, data: FormData): Promise<import("axios").AxiosResponse<any>>;
    export function deleteImage(id: number): Promise<import("axios").AxiosResponse<any>>;
    export function getImageById(id: number): Promise<import("axios").AxiosResponse<any>>;
}
declare module "constants" {
    export const CURRENT_LOCAL = "en_US";
}
declare module "components/Image" {
    import React from "react";
    export type ImageProps = {
        classes: string;
        reff: React.RefObject<HTMLImageElement> | null;
        src: string;
    };
    export default function Image({ classes, reff, src }: ImageProps): JSX.Element;
}
declare module "components/ImageView" {
    export type ImageViewProps = {
        id: number;
        title: string;
        url: string;
        setImgEditing: Function;
    };
    export default function ImageView({ id, title, url, setImgEditing }: ImageViewProps): JSX.Element;
}
declare module "components/Thumbnail" {
    export type ThumbnailProps = {
        id: number;
        url: string;
        title: string;
        onDelete: Function;
        setImgEditing: Function;
    };
    export default function Thumbnail({ id, url, title, onDelete, setImgEditing, }: ThumbnailProps): JSX.Element | null;
}
declare module "components/Grid" {
    export type GridProps = {
        data: any;
        loading: boolean;
        error: string | null;
        arrayImages: Array<{
            id: number;
            title: string;
            url: string;
        }>;
        setArrayImages: Function;
        setImgEditing: Function;
    };
    export default function Grid({ data, loading, error, arrayImages, setArrayImages, setImgEditing }: GridProps): JSX.Element;
}
declare module "components/ManageDetails" {
    export type ManageDetailsProps = {
        id: number;
        title: string;
        croppedFile: {
            lastModified: number;
            lastModifiedDate: null;
            name: string;
            size: number;
            type: string;
            webkitRelativePath: string;
        };
        onAdd: Function;
        onEdit: Function;
        onImgPick: Function;
        onTitleChange: Function;
        emptyPreview: Function;
    };
    export default function ManageDetails({ id, title, croppedFile, onAdd, onEdit, onImgPick, onTitleChange, emptyPreview, }: ManageDetailsProps): JSX.Element;
}
declare module "components/ManageImage" {
    export type ManageImageProps = {
        id: number;
        title: string;
        src: string;
        dynamicPush: Function;
        emptyPreview: Function;
        setImgPreview: Function;
        storeImg: Function;
    };
    export default function ManageImage({ id, title, src, dynamicPush, setImgPreview, emptyPreview, storeImg, }: ManageImageProps): JSX.Element;
}
declare module "library" {
    import "./styles.css";
    export function App(): JSX.Element;
}

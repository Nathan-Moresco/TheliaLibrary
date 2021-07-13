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
declare module "components/AddImage" {
    export type AddImageProps = {
        onAdd: (response: any) => any;
        onImgPick: Function;
    };
    export default function AddImage({ onAdd, onImgPick }: AddImageProps): JSX.Element;
}
declare module "components/Image" {
    import React from "react";
    export type ImageProps = {
        classes: string;
        reff: React.RefObject<HTMLImageElement>;
        src: string;
    };
    export default function Image({ classes, reff, src }: ImageProps): JSX.Element;
}
declare module "components/EditImage" {
    export type EditImageProps = {
        id: number;
        title: string;
        onAdd: Function;
        onEdit: Function;
        onImgPick: Function;
        onTitleChange: Function;
        closeEdit: Function;
    };
    export default function EditImage({ id, title, onAdd, onEdit, onImgPick, onTitleChange, closeEdit, }: EditImageProps): JSX.Element;
}
declare module "components/Modal" {
    export type ModalProps = {
        id: number;
        title: string;
        src: string;
        emptyPreview: Function;
        setImgPreview: Function;
        storeImg: Function;
    };
    export default function Modal({ id, title, src, setImgPreview, emptyPreview, storeImg }: ModalProps): JSX.Element;
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
        limit: number;
        offset: number;
        data: any;
        loading: boolean;
        error: string | null;
        processLock: Function;
        itemManaged: {
            id: number;
            title: string;
            url: string;
        };
        addToGrid: boolean;
        setImgEditing: Function;
    };
    export default function Grid({ limit, offset, data, loading, error, processLock, itemManaged, addToGrid, setImgEditing }: GridProps): JSX.Element;
}
declare module "library" {
    import "./styles.css";
    export function App(): JSX.Element;
}

/// <reference types="react" />
declare module "api" {
    export function getAllImages(params: Record<string, any>): Promise<import("axios").AxiosResponse<any>>;
    export function createImage(data: FormData): Promise<import("axios").AxiosResponse<any>>;
    export function deleteImage(id: number): Promise<import("axios").AxiosResponse<any>>;
    export function getImageById(id: number): Promise<import("axios").AxiosResponse<any>>;
    export function updateImage(id: number, data: FormData): Promise<import("axios").AxiosResponse<any>>;
}
declare module "constants" {
    export const CURRENT_LOCAL = "en_US";
}
declare module "components/AddImage" {
    export type AddImageProps = {
        onAdd: (response: any) => any;
    };
    export default function AddImage({ onAdd }: AddImageProps): JSX.Element;
}
declare module "components/EditImage" {
    export type EditImageProps = {
        id: number;
        title: string;
        url: string;
        onEdit: Function;
    };
    export default function EditImage({ id, title, url, onEdit }: EditImageProps): JSX.Element;
}
declare module "components/Thumbnail" {
    export type ThumbnailProps = {
        id: number;
        url: string;
        title: string;
        onDelete: Function;
        onEdit: Function;
    };
    export default function Thumbnail({ id, url, title, onDelete, onEdit, }: ThumbnailProps): JSX.Element | null;
}
declare module "components/Grid" {
    export type GridProps = {
        data: any;
        loading: boolean;
        error: string | null;
        fetch: Function;
    };
    export default function Grid({ data, loading, error, fetch }: GridProps): JSX.Element;
}
declare module "library" {
    import "./styles.css";
    export function App(): JSX.Element;
}
declare module "components/ImageView" {
    export type ImageViewProps = {
        id: number;
        title: string;
        url: string;
        onEdit: Function;
    };
    export default function ImageView({ id, title, url, onEdit }: ImageViewProps): JSX.Element;
}

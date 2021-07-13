import React from "react";

export type ImageProps = {
  classes: string,
  reff:React.RefObject<HTMLImageElement> | null,
  src: string,
};

export default function Image({ classes, reff, src}: ImageProps) {

    return (
        <img className={classes} ref={reff} src={src} />
    );
}
import React from "react";

export type ImageProps = {
  classes: string;
  src: string;
};

export default function Image({ classes, src }: ImageProps) {
  return <img className={classes} src={src} />;
}

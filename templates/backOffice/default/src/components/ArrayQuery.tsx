import { CURRENT_LOCAL } from "../constants";
import React from "react";
import { createImage } from "../api";

export type ArrayQueryProps = {
  query:string;
  idQuery: number;
};

export default function ArrayQuery({
    query,
    idQuery
}: ArrayQueryProps) {


    return (
        <div className="TheliaLibrary-ArrayQuery">
            
        </div>
    );
}
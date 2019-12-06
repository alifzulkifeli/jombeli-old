import React from "react";
import { API } from "../config";
import ReactDOM from "react-dom";

const ShowImage = ({ item}) => (
    <div className="product-img">
        <img
            src={`${item.image1}`}
            alt={item.name}
            className="mb-3"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
    </div>
);

export default ShowImage;

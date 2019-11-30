import React from "react";
import { API } from "../config";

const ShowImage = ({ item}) => (
    <div className="product-img">
        <img
            src={`${item.image}`}
            alt={item.name}
            className="mb-3"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
    </div>
);

export default ShowImage;

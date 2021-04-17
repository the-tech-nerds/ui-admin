import { json } from 'body-parser'
import React, { useState } from 'react'
import Lightbox from "react-image-lightbox";
import LightboxExample from "./lightbox";

const ImageGalary = (props) => {
    const [isOpen, setOpen] = useState(0);
    const [photoIndex, setPhotoIndex] = useState(0);
    const { options: {
        onDeleteSuccess = () => {
        },
        images = []
    } } = props;
    const deleteImage = (cell) => {
        onDeleteSuccess(cell);
    }
    const openImage = (index) => {
        setPhotoIndex(index)
        setOpen(1)
    }

    return (<div>
        <div className="row img-gallery">

            {images.map((cell, index) => {
                return <div className="single-image">
                    <div className="img-wrap" >
                        <span className="close" onClick={() => deleteImage(cell)}>&times;</span>
                        <img onClick={() => openImage(index)} className="item-image img-rounded" src={cell.url}></img>
                    </div>
                </div>;


            })}
        </div>
        { isOpen == 1 && <LightboxExample images={images} isOpen={isOpen} index={photoIndex} response={() => {
            setOpen(0);
        }} />}
    </div>

    )
}

export default ImageGalary

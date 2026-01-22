import React from 'react'
import { IMAGE_URL, SAMPLE_IMAGE1, SAMPLE_IMAGE2 } from '../utils/helper'

const ImageComponent = ({
    src,
    className,
    dummyImage = 1
}) => {
    return (
        <div>
            <img
                className={`rounded-full overflow-hidden object-cover object-top ${className}`}
                src={
                    (src != null || src != undefined )
                        ? `${IMAGE_URL}/${src}`
                        : dummyImage === 1 ? SAMPLE_IMAGE1 : SAMPLE_IMAGE2
                }
                alt="profile image"
            />
        </div>
    )
}

export default ImageComponent
import React from 'react'
import { IMAGE_URL, SAMPLE_IMAGE1 } from '../utils/helper'

const ImageComponent = ({
    src,
    className,
}) => {
    return (
        <div>
            <img
                class={`rounded-full overflow-hidden object-cover ${className}`}
                src={
                    (src != null || src != undefined )
                        ? `${IMAGE_URL}/${src}`
                        : SAMPLE_IMAGE1
                }
                alt="profile image"
            />
        </div>
    )
}

export default ImageComponent
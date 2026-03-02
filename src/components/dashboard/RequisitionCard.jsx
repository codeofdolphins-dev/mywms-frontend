import React from 'react'
import ImageComponent from '../ImageComponent'

const RequisitionCard = () => {
    return (
        <div className='panel !rounded-2xl space-y-5'>

            {/* first row */}
            <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                    <p>Tenant Company</p>
                </div>
                <div className="">
                    <ImageComponent
                        dummyImage={3}
                        className={"w-20 h-20"}

                    />
                </div>
            </div>

            {/* 2nd row */}
            <div className="">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque illum unde.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque illum unde.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque illum unde.</p>
            </div>

            {/* 3rd row */}
            <div className="">
                <p>2 days ago</p>
            </div>

        </div>
    )
}

export default RequisitionCard
import React from 'react'
import { BsBoxSeam } from 'react-icons/bs'

const NoRecord = () => {
    return (
        <div className="min-h-64 flex justify-center items-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <BsBoxSeam fontSize={40} color='grey' />
                <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
            </div>
        </div>
    )
}

export default NoRecord
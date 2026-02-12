import React from 'react'

const Card = ({
    header,
    number,
    Icon,
    IconColor,
    IconBgColor,
}) => {
    return (
        <div className="sm:max-w-[25rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded-lg border border-white-light">
            <div className="py-2 px-4 flex items-center justify-between">
                <div className="">
                    <h5 className="text-[#3b3f5c] text-sm font-semibold mb-4">{header || "Simple"}</h5>
                    <p className="text-xl font-bold"> {number || 300} </p>
                </div>
                <div className={`p-3 rounded-full ${IconColor} ${IconBgColor}`}>
                    <Icon
                        size={24}
                    />
                </div>
            </div>
        </div>
    )
}

export default Card
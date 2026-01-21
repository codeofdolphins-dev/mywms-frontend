import React from 'react'
import ImageComponent from '../../../ImageComponent'

const BasicCardContent = ({
    isBadge = false,
    badgeText = "loading...",
    badgecolor = "bg-success",
    primaryText = "loading...",
    secondaryText = "loading...",
}) => {
    return (
        <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
            <div className="flex items-center justify-between py-2">
                <div className="flex-none">
                    <ImageComponent
                        className={"h-12 w-12"}
                    />
                </div>
                <div className="flex items-center justify-between flex-auto ltr:ml-4 rtl:mr-4">
                    <h6 className="text-[#515365] font-semibold dark:text-white-dark">
                        {primaryText}
                        <span className="block text-white-dark dark:text-white-light">{secondaryText}</span>
                    </h6>
                    {isBadge && <span className={`badge whitespace-nowrap ltr:ml-auto rtl:mr-auto ${badgecolor}`}>{badgeText}</span>}
                </div>
            </div>
        </div>
    )
}

export default BasicCardContent
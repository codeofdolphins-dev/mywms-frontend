import React from 'react'
import Button from '../../inputs/Button'

const ActivityCard = ({
    cardTitle = "Details",
    buttonTitle = "Details",
    children
}) => {
    return (
        < div className="panel" >
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">{cardTitle}</h5>
                <Button
                    className={"btn btn-info"}
                    icon={true}
                >
                    {buttonTitle}
                </Button>
            </div>
            <div className="">
                <div className="h-96 flex-1 overflow-y-auto p-4 space-y-2">
                    {children}
                </div>
            </div>
        </div >
    )
}

export default ActivityCard
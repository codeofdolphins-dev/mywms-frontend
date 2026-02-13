import React, { useId } from 'react'

const BooleanSwitch = ({
    label = "Status",
    labelPosition = "",
    ...rest
}, ref) => {

    const _id = useId();

    return (
        <div className={`w-full ${labelPosition === "inline" ? "flex items-center justify-between gap-5" : ""} `}>
            {label && <label
                htmlFor={_id}
                className={`inline-block mb-1 pl-1 text-sm text-gray-600 ${labelPosition === "inline" ? "w-1/3" : ""}`}
            >
                {label}
            </label>}
            <div className={`${labelPosition === "inline" ? "w-2/3" : ""}`}>
                <label className="w-12 h-6 relative">
                    <input
                        id={_id}
                        ref={ref}
                        type="checkbox"
                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                        {...rest}
                    />
                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                </label>
            </div>
        </div>
    )
}

export default React.forwardRef(BooleanSwitch);
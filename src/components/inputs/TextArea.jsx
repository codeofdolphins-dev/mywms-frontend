import React, { useId } from 'react'

const TextArea = ({
    label = "",
    rows = 3,
    className = "",
    labelPosition,
    labelcolor = "text-gray-600",
    ...rest
}, ref) => {
    const _id = useId();
    return (
        <div className={`w-full ${labelPosition === "inline" ? "flex items-center justify-between gap-2" : ""} `}>
            {label && <label
                htmlFor={_id}
                className={`inline-block mb-1 pl-1 text-sm ${labelcolor} ${labelPosition === "inline" ? "w-1/3" : ""}`}
            >
                {label}
            </label>}
            <textarea
                id={_id}
                rows={rows}
                className={`px-3 py-2 text-sm rounded-md  focus:outline-2 outline-blue-500 duration-200 border border-[#b3b3b3c7] w-full ${className}`}
                ref={ref}
                {...rest}
            />
        </div>
    )
}

export default React.forwardRef(TextArea);
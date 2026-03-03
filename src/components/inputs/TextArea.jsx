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
                className={`inline-block mb-1 pl-1 text-sm self-start ${labelcolor} ${labelPosition === "inline" ? "w-1/3" : ""}`}
            >
                {label}
            </label>}
            <textarea
                id={_id}
                rows={rows}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full placeholder:text-sm ${className}`}
                ref={ref}
                {...rest}
            />
        </div>
    )
}

export default React.forwardRef(TextArea);
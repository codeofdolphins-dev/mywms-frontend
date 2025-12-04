import React, { useId } from 'react'

const TextArea = ({
    label = "",
    rows = 3,
    className = "",
    ...rest
}, ref) => {
    const _id = useId();
    return (
        <div>
            {label && <label
                htmlFor={_id}
                className='inline-block mb-1 pl-1'
            >
                {label}
            </label>}
            <textarea
                id={_id}
                rows={3}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                ref={ref}
                {...rest}
            />
        </div>
    )
}

export default React.forwardRef(TextArea);
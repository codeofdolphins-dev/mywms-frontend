import React, { useId } from 'react'

const CheckBox = ({
    label = "",
    labelPosition = "",
    className = "outline-primary",
    checked = false,
    onChange = () => { },
    ...rest
}, ref) => {
    const _id = useId()
    return (
        <div className={`w-full flex items-center justify-center gap-3 ${labelPosition === "start" ? "flex-row-reverse" : ""} `}>
            <input 
                type="checkbox"
                className={`form-checkbox ${className}`}
                ref={ref}
                id={_id}
                checked={checked}
                onChange={onChange}
                {...rest}
            />
            {
                label && <label htmlFor={_id} className='whitespace-nowrap text-xs mb-0 cursor-pointer' >{label}</label>
            }
        </div>
    )
}

export default React.forwardRef(CheckBox);
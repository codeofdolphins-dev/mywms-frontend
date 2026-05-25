import React from 'react'

const BasicFilterSelect = ({
    onChange,
    value,
    options,
    className,
    optionClassName,
    disabled
}) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`border-gray-200 rounded-lg p-2 border text-sm font-semibold font-sans ${className}`}
            disabled={disabled}
        >
            {options?.map((item, idx) =>
                <option key={idx} className={`text-sm font-semibold font-sans ${optionClassName}`} value={item.value}>{item.label}</option>
            )}
        </select>
    )
}

export default BasicFilterSelect
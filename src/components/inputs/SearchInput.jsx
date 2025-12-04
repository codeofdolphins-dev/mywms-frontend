import React, { useId } from 'react'
import { FaRegTimesCircle } from "react-icons/fa";

const SearchInput = ({
    label = '',
    type = 'text',
    className = '',
    value = '',
    setValue = () => { },
    ...rest
}) => {

    const _id = useId();

    return (
        <div className='w-full'>
            {label && <label htmlFor={_id} className="block mb-2 font-medium">{label}</label>}
            <div className="form-input flex items-center">
                <input
                    id={_id}
                    type={type}
                    className={`w-full focus:outline-none pe-3 ${className}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    {...rest}
                />
                {
                    (value !== '') &&
                    <FaRegTimesCircle
                        className='cursor-pointer hover:text-danger hover:scale-105'
                        onClick={() => setValue('')}
                    />
                }
            </div>
        </div>
    )
}

export default SearchInput;
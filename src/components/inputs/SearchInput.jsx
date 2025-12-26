import { debounce } from 'lodash';
import React, { useCallback, useEffect, useId, useState } from 'react'
import { FaRegTimesCircle } from "react-icons/fa";

const SearchInput = ({
    label = '',
    type = 'text',
    className = '',
    setValue,
    ...rest
}) => {

    const _id = useId();
    const [search, setSearch] = useState('');

    const deBounceFn = useCallback(
        debounce((value) => {
            setValue(value);
        }, 500),
        []
    )

    function handelSearch(value) {
        setSearch(value);
        deBounceFn(value);
    }

    useEffect(() => {
        return() => deBounceFn.cancel();
    },[])

    return (
        <div className='w-full'>
            {label && <label htmlFor={_id} className="block mb-2 font-medium">{label}</label>}
            <div className="flex items-center border border-[#b3b3b398] bg-white py-1.5 px-2 rounded-md">
                <input
                    id={_id}
                    type={type}
                    className={`w-full focus:outline-none pe-3 text-base ${className}`}
                    value={search}
                    onChange={(e) => handelSearch(e.target.value)}
                    {...rest}
                />
                {
                    (search !== '') &&
                    <FaRegTimesCircle
                        className='cursor-pointer hover:text-danger hover:scale-105'
                        onClick={() => handelSearch('')}
                    />
                }
            </div>
        </div>
    )
}

export default SearchInput;
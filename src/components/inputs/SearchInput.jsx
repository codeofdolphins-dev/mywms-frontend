import { debounce } from 'lodash';
import React, { useCallback, useEffect, useId, useState } from 'react'
import { FaRegTimesCircle } from "react-icons/fa";
import { FiPlus } from 'react-icons/fi';

const SearchInput = ({
    label = '',
    type = 'text',
    className = '',
    setValue,

    addButton = false,
    btnTitle,
    btnOnClick,
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
        return () => deBounceFn.cancel();
    }, [])

    return (
        <div className='w-full sm:w-8/12 mx-auto'>
            <div className="w-full flex">
                {label && <label htmlFor={_id} className="block mb-2 font-medium">{label}</label>}
                <div className={`w-full flex items-center border border-[#b3b3b398] bg-white py-1.5 px-2 ${addButton ? "rounded-l-md" : "rounded-md" }`}>
                    <input
                        id={_id}
                        type={type}
                        className={`w-full focus:outline-none pe-3 text-sm ${className}`}
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
                {addButton &&
                    <button
                        className='px-3 btn-primary text-white rounded-r-md flex items-center whitespace-nowrap'
                        onClick={btnOnClick}
                    >
                        <FiPlus size={20} className='mr-2' />{btnTitle}
                    </button>
                }
            </div>
        </div>
    )
}

export default SearchInput;
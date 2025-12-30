import Select from 'react-select';
import React, { useId } from 'react'
import IconCode from '../Icon/IconCode';


const SearchableSelect = ({
    label = '',
    options = [],
    isSearchable = true,
    error,
    value,
    onChange
}, ref) => {

    const _id = useId();

    return (
        <div className='w-full'>
            {label && <label className='block text-sm font-medium text-gray-700' htmlFor={_id}>{label}</label>}
            <div className="">
                <Select
                    {...ref}
                    options={options}
                    isSearchable={isSearchable}
                    value={options.find(opt => opt.value === value) || null}
                    onChange={val => onChange(val?.value)}
                />
            </div>
            {error && <span className='text-danger'>{error}</span>}
        </div>
    )
}

export default React.forwardRef(SearchableSelect);



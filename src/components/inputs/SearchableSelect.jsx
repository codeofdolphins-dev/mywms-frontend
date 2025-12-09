import Select from 'react-select';
import React, { useId } from 'react'
import IconCode from '../Icon/IconCode';


const SearchableSelect = ({
    id = "",
    label = '',
    value = "",
    setValue = {},
    options = [],
    isSearchable = true
}) => {

    const _id = id || useId();

    return (
        <div className='w-full'>
            {label && <label htmlFor={_id}>{label}</label>}
            <div className="">
                <Select
                    defaultValue={value}
                    options={options}
                    isSearchable={isSearchable}
                    onChange = {((option) => setValue(option?.value))}
                />  
            </div>
        </div>
    )
}

export default SearchableSelect;



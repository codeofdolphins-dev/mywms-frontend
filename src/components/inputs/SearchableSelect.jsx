import Select from 'react-select';
import React, { useId } from 'react'
import IconCode from '../Icon/IconCode';

const options = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];


const SearchableSelect = ({
    id = "",
    label = '',
    setValue = {}
}) => {

    const _id = id || useId();

    return (
        <div className='w-full'>
            {label && <label htmlFor={_id}>{label}</label>}
            <div className="">
                <Select
                    defaultValue={options[0]}
                    options={options}
                    isSearchable={true}
                    onChange = {((option) => setValue(option?.value))}
                />  
            </div>
        </div>
    )
}

export default SearchableSelect;



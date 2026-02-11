import React from 'react';
import SearchInput from './inputs/SearchInput';
import Breadcrumb from './Breadcrumb';

const ComponentHeader = ({
    headerLink = [],

    primaryText = '',
    secondaryText = '',
    searchPlaceholder = '',
    searchClassName = "",
    btnTitle = "",
    setDebounceSearch,
    btnOnClick,
    addButton = true,
    className = "justify-between",
}) => {
    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-5 ${className}`}>
            {
                headerLink.length > 0 &&
                <Breadcrumb
                    options={headerLink}
                    className='self-start sm:self-center'
                />
            }
            <SearchInput
                type="text"
                placeholder={searchPlaceholder}
                className={searchClassName}
                setValue={setDebounceSearch}

                addButton={addButton}
                btnTitle={btnTitle}
                btnOnClick={btnOnClick}
            />

            {/* <div className="flex justify-between items-center">
                <div>
                    {primaryText && <h1 className="text-2xl font-bold">{primaryText}</h1>}
                    {secondaryText && <p className='text-gray-600 text-base'>{secondaryText}</p>}
                </div>

            </div > */}
        </div>
    )
}

export default ComponentHeader
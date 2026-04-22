import React from 'react';
import SearchInput from './inputs/SearchInput';
import Breadcrumb from './Breadcrumb';

const ComponentHeader = ({
    headerLink = [],

    // primaryText = '',
    // secondaryText = '',
    showSearch = true,
    searchPlaceholder = '',
    searchClassName = "",
    setDebounceSearch,

    addButton = true,
    btnTitle = "",
    btnOnClick,
    
    addButton2 = false,
    btn2Title = "",
    btn2OnClick,
    
    addButton3 = false,
    btn3Title = "",
    btn3OnClick,

    className = "justify-between",
}) => {
    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-5 ${className}`}>
            {headerLink.length > 0 &&
                <Breadcrumb
                    options={headerLink}
                    className='self-start sm:self-center'
                />
            }
            {showSearch &&
                <SearchInput
                    type="text"
                    placeholder={searchPlaceholder}
                    className={searchClassName}
                    setValue={setDebounceSearch}

                    addButton={addButton}
                    btnTitle={btnTitle}
                    btnOnClick={btnOnClick}
                    
                    addButton2={addButton2}
                    btn2Title={btn2Title}
                    btn2OnClick={btn2OnClick}
                   
                    addButton3={addButton3}
                    btn3Title={btn3Title}
                    btn3OnClick={btn3OnClick}
                />
            }

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
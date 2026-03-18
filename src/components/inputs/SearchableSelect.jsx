import Select from 'react-select';
import React, { useId } from 'react';

const SearchableSelect = ({
        label = '',
        labelPosition = '',
        options = [],
        isSearchable = true,
        disabled = false,
        error,
        value,
        onChange,
    },
    ref
) => {
    const _id = useId();

    return (
        <div className={`w-full ${labelPosition === "inline" ? "flex items-center justify-between gap-2" : ""}`}>
            {label && (
                <label
                    htmlFor={_id}
                    className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'
                        } ${labelPosition === "inline" ? "w-1/3" : ""}`}
                >
                    {label}
                </label>
            )}

            <div className="w-full">
                <Select
                    ref={ref}
                    inputId={_id}
                    options={options}
                    isSearchable={isSearchable}
                    isDisabled={disabled}
                    value={options.find(opt => opt.value === value) || null}
                    onChange={val => {
                        if (!disabled) {
                            onChange?.(val?.value);
                        }
                    }}
                    classNamePrefix="react-select"
                    styles={{
                        control: (base) => ({
                            ...base,
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: disabled ? 0.6 : 1,
                        }),
                    }}
                />

                {error && !disabled && (
                    <span className="text-red-500 text-xs mt-1 block">
                        {error}
                    </span>
                )}
            </div>
        </div>
    );
};

export default React.forwardRef(SearchableSelect);

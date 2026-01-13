import React from "react";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";

function RHSelect({
    selectKey = "name",
    selectSubKey = "full_name",
    label,
    options = [],
    value,
    onChange,
    isMulti = false,
    placeholder = "Select...",
    disabled = false,
    required = false,
    error = '',
    className = '',
    objectReturn = false,

    addButton = false,
    buttonTitle = "Add",
    buttonOnClick,
}, ref) {

    const selectRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
        focus: () => {
            selectRef.current?.focus();
        }
    }));

    const getValue = () => {
        if (!value) return isMulti ? [] : null;

        if (isMulti) {
            return options.filter((opt) => value.includes(opt.id))
        } else {
            if (objectReturn) {
                return options.find((opt) => opt.id === value.id) || null;
            } else {
                return options.find((opt) => opt.id === value) || null;
            }
        }
    };

    return (
        <div className="space-y-1 w-full">
            {label && (
                <label
                    className={`block text-sm font-medium mb-0 ${disabled ? "text-gray-400" : "text-gray-700"}`}
                >
                    {label}{required ? <span className='text-danger'>*</span> : ''}
                </label>
            )}

            <div className="flex">
                <Select
                    value={getValue()}
                    ref={selectRef}
                    inputRef={ref}
                    onChange={(selected) => {
                        if (disabled) return; // prevent interaction when disabled
                        if (isMulti) {
                            if (objectReturn) {
                                onChange(selected || []);
                            } else {
                                onChange(selected ? selected.map((opt) => opt.id) : []);
                            }
                        } else {
                            if (objectReturn) {
                                onChange(selected || []);
                            } else {
                                onChange(selected ? selected.id : null);
                            }
                        }
                    }}
                    options={options}
                    getOptionLabel={option => {
                        return typeof option[selectKey] === "object" ? option[selectKey]?.[selectSubKey] : option[selectKey]
                    }}
                    getOptionValue={option => option.id}
                    isMulti={isMulti}
                    isDisabled={disabled}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    className={`text-sm flex-1 rounded-r-none ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderTopRightRadius: addButton ? 0 : base.borderTopRightRadius,
                            borderBottomRightRadius: addButton ? 0 : base.borderBottomRightRadius,
                        }),
                    }}
                />
                {
                    addButton &&
                    <button
                        className="px-4 btn-info text-white rounded-r flex items-center"
                        onClick={buttonOnClick}
                        type="button"
                    >
                        <FiPlus size={20} />{buttonTitle}
                    </button>
                }
            </div>
            {error && <span className='text-danger'>{error}</span>}
        </div>
    );
}

export default React.forwardRef(RHSelect);

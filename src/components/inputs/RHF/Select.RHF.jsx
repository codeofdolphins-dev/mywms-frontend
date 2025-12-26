import React from "react";
import Select from "react-select";

function RHSelect({
    selectKey = "name",
    label,
    options = [],
    value,
    onChange,
    isMulti = false,
    placeholder = "Select...",
    disabled = false,
    required = false,
    error = ''
}, ref) {

    const selectRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
        focus: () => {
            selectRef.current?.focus();
        }
    }));

    const getValue = () => {
        if (!value) return isMulti ? [] : null;
        return isMulti
            ? options.filter((opt) => value.includes(opt.id))
            : options.find((opt) => opt.id === value) || null;
    };

    return (
        <div className="space-y-1">
            {label && (
                <label
                    className={`block text-sm font-medium mb-0 ${disabled ? "text-gray-400" : "text-gray-700"}`}
                >
                    {label}{required ? <span className='text-danger'>*</span> : ''}
                </label>
            )}

            <Select
                value={getValue()}
                ref={selectRef}
                inputRef={ref}
                onChange={(selected) => {
                    if (disabled) return; // prevent interaction when disabled
                    if (isMulti) {
                        onChange(selected ? selected.map((opt) => opt.id) : []);
                    } else {
                        onChange(selected ? selected.id : null);
                    }
                }}
                options={options}
                getOptionLabel={option => option[selectKey]}
                getOptionValue={option => option.id}
                isMulti={isMulti}
                isDisabled={disabled}
                placeholder={placeholder}
                classNamePrefix="react-select"
                className={`text-sm ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            {error && <span className='text-danger'>{error}</span>}
        </div>
    );
}

export default React.forwardRef(RHSelect);

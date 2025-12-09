import React from "react";

const RHRadioGroup = React.forwardRef(({
    label,
    options = [],
    value,
    onChange,
    error,
    required
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="flex flex-row space-x-2 mt-2">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        <input
                            ref={ref}
                            type="radio"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                            className={`h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 ${error ? "ring-red-500 border-red-500" : ""}`}
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
);

export default RHRadioGroup;

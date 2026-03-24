import React from "react";

const RHRadioGroup = React.forwardRef(({
    label,
    labelPosition = '',
    options = [],
    value,
    disabled = false,
    onChange,
    error,
    required
}, ref) => {
    return (
        <div className={`w-full ${labelPosition === "inline" ? "flex items-center justify-between gap-2" : ""}`}>
            {label && (
                <label
                    className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} ${labelPosition === "inline" ? "w-1/3" : ""}`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="w-full flex space-x-4">
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

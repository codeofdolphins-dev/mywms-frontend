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

            <div className="w-full">
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
                                title={opt.title}
                            />
                            <span title={opt.title}>{opt.label}</span>
                        </label>
                    ))}
                </div>

                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        </div>
    );
}
);

export default RHRadioGroup;

{/* <Controller
    name="type"
    control={control}
    rules={{ required: "Cost Type is required!!!" }}
    render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <RHRadioGroup
            ref={(el) => {
                ref({
                    focus: () => el?.focus(),
                });
            }}
            value={value}
            onChange={onChange}
            label="Cost Type"
            options={[
                { label: "Monthly", value: "monthly" },
                { label: "One-Time", value: "onetime" },
                { label: "Yearly", value: "yearly" },
            ]}
            error={error?.message}
            required={true}
        />
    )}
/> */}
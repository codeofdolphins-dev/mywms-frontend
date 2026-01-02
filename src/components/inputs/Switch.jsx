import React, { useId } from 'react'

const Switch = ({
    label,
    value,
    defaultCheck,
    className,
    ...rest
}, ref) => {

    const _id = useId();

    return (
        <div className="w-full flex !justify-between items-center">
            {label && <label htmlFor={_id}>{label}</label>}
            <label className="w-12 h-6 relative">
                <input
                    ref={ref}
                    id={_id}
                    type="checkbox"
                    value={value}
                    defaultChecked={defaultCheck}
                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                    { ...rest }
                />
                <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
            </label>
        </div>
    )
}

export default React.forwardRef(Switch);
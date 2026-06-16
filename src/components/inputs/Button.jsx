import React from 'react'
import { FiPlus } from 'react-icons/fi';

const Button = ({
    type = "button",
    onClick,
    className,
    icon = false,
    title,
    children,
    props
}, ref) => {
    return (
        <button
            ref={ref}
            type={type}
            className={`${className}`}
            onClick={onClick}
            title={title}
            {...props}
        >
            {icon && <FiPlus size={20} className='mr-2' />}
            {children}
        </button>
    )
}

export default React.forwardRef(Button);
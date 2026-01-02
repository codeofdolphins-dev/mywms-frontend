import React from 'react'

const Button = ({
    type = "button",
    onClick,
    className,
    children
}, ref) => {
    return (
        <button
            ref={ref}
            type={type}
            className={` ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default React.forwardRef(Button);
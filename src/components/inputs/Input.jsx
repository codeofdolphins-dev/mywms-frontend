// import React, { useId } from 'react'
// import { FaRegTimesCircle } from "react-icons/fa";

// const Input = React.forwardRef(({
//     label = '',
//     type = 'text',
//     className = '',
//     ...rest
// }, ref) => {

//     const _id = useId();

//     return (
//         <div className='w-full'>
//             {label && <label htmlFor={_id} className="block mb-2 font-medium">{label}</label>}
//             <div className="form-input flex items-center">
//                 <input
//                     id={_id}
//                     type={type}
//                     className={`w-full focus:outline-none pe-3 ${className}`}
//                     ref={ref}
//                     {...rest}
//                 />
//             </div>
//         </div>
//     )
// });

// export default Input;


import React, { useId } from 'react'

const Input = React.forwardRef(({
    label,
    type = 'text',
    className = '',
    error,
    ...props
}, ref) => {

    const id = useId();

    return (
        <div className="w-full">
            {
                label && <label
                    htmlFor={id}
                    className='inline-block mb-1 pl-1'
                >
                    {label}
                </label>
            }
            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${error ? "border-red-500" : ""} ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
             {error && <span className='text-danger'>This field is required</span>}
        </div>
    )
})

export default Input
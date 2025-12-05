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
    required=false,
    ...props
}, ref) => {

    const _id = useId();

    return (
        <div className="w-full">
            {
                label && <label
                    htmlFor={_id}
                    className='inline-block mb-0 pl-1 text-sm text-gray-600'
                >
                    {label}{required ? <span className='text-danger'>*</span> : ''}
                </label>
            }
            <input
                id={_id}
                type={type}
                className={`px-3 py-1.5 text-sm rounded-md bg-white text-black outline-none duration-200 border border-[#B3B3B3] w-full ${error ? "border-red-500" : ""} ${className}`}
                ref={ref}
                {...props}
            />
             {error && <span className='text-danger'>This field is required</span>}
        </div>
    )
})

export default Input
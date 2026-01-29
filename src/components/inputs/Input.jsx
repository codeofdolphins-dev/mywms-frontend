
import React, { useId, useState } from 'react'
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const Input = React.forwardRef(({
    label,
    labelPosition = "",
    type = 'text',
    className = '',
    error,
    required = false,
    isLoading = false,
    ...props
}, ref) => {

    const _id = useId();
    const [isPasswordSeen, setIsPasswordSeen] = useState(false);


    return (
        <div className={`w-full ${labelPosition === "inline" ? "flex items-center justify-between" : ""} `}>
            {
                label && <label
                    htmlFor={_id}
                    className={`inline-block mb-1 pl-1 text-sm text-gray-600 ${labelPosition === "inline" ? "w-1/3" : ""}`}
                >
                    {label}{required ? <span className='text-danger'>*</span> : ''}
                </label>
            }
            <div className={`relative ${labelPosition === "inline" ? "w-2/3" : ""} `}>
                <input
                    id={_id}
                    type={isPasswordSeen ? "text" : type}
                    className={`px-3 py-2 text-sm rounded-md  focus:outline-2 outline-blue-500 duration-200 border border-[#b3b3b3c7] w-full ${error ? "border-red-500" : ""} ${props.disabled ? "bg-gray-200 text-gray-500" : "bg-white text-black"} ${className}`}
                    ref={ref}
                    {...props}
                />
                {
                    type === "password" &&
                    <span
                        className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsPasswordSeen(prev => !prev)}
                    >
                        {
                            isPasswordSeen
                                ? <PiEyeBold size={22} />
                                : <PiEyeClosed size={22} />
                        }
                    </span>
                }
                {
                    isLoading &&
                    <span
                        className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                        <AiOutlineLoading3Quarters
                            className='animate-spin'
                        />
                    </span>
                }
            </div>

            {error && <span className='text-danger text-sm'>{error}</span>}
        </div>
    )
})

export default Input
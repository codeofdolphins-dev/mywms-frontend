import React from 'react'
import { useForm } from 'react-hook-form'
import { FiSearch } from 'react-icons/fi'

const dummy = [
    {
        key: "rfq_no",
        type: "text",
        placeholder: "RFQ no.",
        classsName: "",
    },
    {
        key: "location",
        type: "text",
        placeholder: "Location",
        classsName: "",
    },
    {
        key: "company",
        type: "text",
        placeholder: "Company",
        classsName: "",
    }
]

const MultiAttributeSearch = ({
    options = dummy,
    setSearchObject
}) => {

    const { handleSubmit, register, reset } = useForm();

    const onSubmit = (data) => {
        setSearchObject(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-between items-center gap-3 bg-[#FFFFFF] px-4 py-2 border rounded-full'>
            <FiSearch size={20} />

            <div className={`w-full grid grid-cols-${options?.length} gap-2`}>
                {options?.map((item, idx) => (
                    <div
                        key={idx}
                        className={`w-full ${idx !== options?.length - 1 ? 'border-r-2 border-gray-300' : ''} px-2`}
                    >
                        <input
                            type={item?.type}
                            className={`w-full focus:outline-none`}
                            placeholder={item?.placeholder}
                            {...register(item?.key)}
                        />
                    </div>
                ))}
            </div>

            <span className="text-sm font-medium text-gray-400 cursor-pointer hover:underline hover:text-blue-500 transition duration-300" onClick={() => {
                reset();
                setSearchObject({});
            }}>
                Clear
            </span>

            <button
                type="submit"
                className='btn-primary text-white rounded-full text-base font-semibold px-5 py-1.5 flex items-center gap-2'
            >
                Search
            </button>
        </form>
    )
}

export default MultiAttributeSearch
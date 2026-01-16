import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

const CreateUser = () => {

    const { handleSubmit, register, control, reset, formState: { errors } } = useForm();
    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/admin" className="text-primary hover:underline">
                        admin
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>user-register</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold my-3">User Register & Assign</h1>
                </div>
            </div>
        </div>
    )
}

export default CreateUser
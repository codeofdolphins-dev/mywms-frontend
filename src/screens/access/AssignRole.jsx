import React, { useState } from 'react'
import Switch from '../../components/inputs/Switch';
import { useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import ButtonBoolean from '../../components/inputs/ButtonBoolean';


const allPermissions = {
    role: [
        { id: 1, action: "create", full: "role:create" },
        { id: 2, action: "read", full: "role:read" },
        { id: 3, action: "update", full: "role:update" },
        { id: 4, action: "delete", full: "role:delete" },
        { id: 5, action: "assign", full: "role:assign" },
        { id: 6, action: "remove", full: "role:remove" }
    ],

    vehicle: [
        { id: 7, action: "create", full: "vehicle:create" },
        { id: 8, action: "read", full: "vehicle:read" },
        { id: 9, action: "update", full: "vehicle:update" },
        { id: 10, action: "delete", full: "vehicle:delete" }
    ],

    drive: [
        { id: 11, action: "create", full: "drive:create" },
        { id: 12, action: "read", full: "drive:read" },
        { id: 13, action: "update", full: "drive:update" },
        { id: 14, action: "delete", full: "drive:delete" }
    ],

    permission: [
        { id: 15, action: "read", full: "permission:read" },
        { id: 16, action: "modify", full: "permission:modify" }
    ],

    company: [
        { id: 17, action: "create", full: "company:create" },
        { id: 18, action: "read", full: "company:read" },
        { id: 19, action: "update", full: "company:update" },
        { id: 20, action: "delete", full: "company:delete" }
    ],

    employee: [
        { id: 21, action: "create", full: "employee:create" },
        { id: 22, action: "read", full: "employee:read" },
        { id: 23, action: "update", full: "employee:update" },
        { id: 24, action: "delete", full: "employee:delete" }
    ],

    inward: [
        { id: 25, action: "create", full: "inward:create" },
        { id: 26, action: "read", full: "inward:read" },
        { id: 27, action: "delete", full: "inward:delete" },
        { id: 28, action: "update", full: "inward:update" }
    ],

    "inward-item": [
        { id: 29, action: "update", full: "inward-item:update" }
    ],

    invoice: [
        { id: 30, action: "create", full: "invoice:create" },
        { id: 31, action: "read", full: "invoice:read" },
        { id: 32, action: "delete", full: "invoice:delete" },
        { id: 33, action: "update", full: "invoice:update" }
    ]
};
const allowed = [1, 2, 3, 4, 5, 7, 8, 11];


const AssignRole = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false)

    const { register, handleSubmit } = useForm({
        defaultValues: {
            permissions: allowed
        }
    });

    const onSubmit = (data) => {
        const formatArray = data.permissions.map(Number);
        console.log("Selected permission IDs:", formatArray);
    };

    return (
        <>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span> Access </span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/access/role" className="text-primary hover:underline">
                        Role
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span> Assign Permission </span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-3xl font-bold my-3">Assign Permissions to Role: $</h1>
                </div>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
                {Object.entries(allPermissions).map(([groupName, permissions]) => (
                    <div
                        key={groupName}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            {groupName}
                        </h3>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {permissions.map((permission) => (
                                <label
                                    key={permission.id}
                                    className="flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 hover:bg-gray-50"
                                >
                                    <Switch
                                        label={permission.action}
                                        value={permission.id}
                                        defaultCheck={allowed.includes(permission.id)}
                                        {...register("permissions")}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between">
                    <button
                        type='button'
                        onClick={() => navigate(-1)}
                        className='btn btn-outline-dark mr-6'
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Save Permissions
                    </Button>
                </div>
            </form>
        </>
    );
}

export default AssignRole
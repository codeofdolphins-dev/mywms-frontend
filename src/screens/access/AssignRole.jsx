import React, { useEffect, useState } from 'react'
import Switch from '../../components/inputs/Switch';
import { useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ButtonBoolean from '../../components/inputs/ButtonBoolean';
import ComponentHeader from '../../components/ComponentHeader';
import manageAccess from '../../Backend/manageAccess.backend';
import masterData from '../../Backend/master.backend';


const headerLink = [
    { title: "role", link: "/access/role" },
    { title: "assign permission" },
];


const AssignRole = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { mutateAsync: updateData, isPending } = masterData.TQUpdateMaster(["rolePermission", "currentUser"]);

    const { data, isLoading } = manageAccess.TQRolePermission(id, Boolean(id));

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            permissions: []
        }
    });


    useEffect(() => {
        if (data?.data?.allowed) {
            setValue("permissions", data.data.allowed.map(String))
        }
    }, [data, isLoading, setValue]);


    const onSubmit = async (data) => {
        const formatArray = data.permissions.map(Number);

        try {
            const res = await updateData({ path: "/manage-permission/manage-permissions", formData: { roleId: id, assignedPermissionIds: formatArray } });
            if (res) {
                console.log(res);
            }
        } catch (error) {
            if (data?.data?.allowed) {
                setValue("permissions", data.data.allowed.map(String));
            }
        }
    };

    return (
        <>
            {/* breadcrumb */}
            <ComponentHeader
                headerLink={headerLink}
                showSearch={false}
            />

            {/* Header Section */}
            <div className="flex justify-between items-center mt-2">
                <div>
                    <h1 className="text-xl font-bold my-3">Assign Permissions to Role: <span className="text-blue-600 uppercase">{data?.data?.role?.role}</span></h1>
                </div>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
                {Object.entries(data?.data?.allPermissions ?? {})?.map(([groupName, permissions]) => (
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
                                        // defaultCheck={data?.data?.allowed?.includes(permission.id)}
                                        {...register("permissions")}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between sticky bottom-4 z-10 bg-white p-4 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-100">
                    <button
                        type='button'
                        onClick={() => navigate(-1)}
                        className='btn btn-outline-dark mr-6'
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        className="mr-5 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {isPending ? 'Saving...' : 'Save Permissions'}
                    </Button>
                </div>
            </form>
        </>
    );
}

export default AssignRole
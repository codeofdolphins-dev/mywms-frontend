import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import RHSelect from '../../inputs/RHF/Select.RHF';
import manageAccess from '../../../Backend/manageAccess.backend';
import masterData from '../../../Backend/master.backend';

const AssignRoleForm = ({ setIsShow, userId, onSuccess }) => {

    const { mutateAsync: updateData, isPending } = masterData.TQUpdateMaster()


    const { data: rolesData, isLoading: rolesLoading } = manageAccess.TQAllRole({ id: userId });


    const { handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            role: []
        },
        values: {
            role: rolesData?.data?.assignRoles || []
        }
    });


    const submit = async (data) => {
        // console.log(data); return;

        try {
            const payload = {
                userId,
                userRole: data?.role?.map(r => r.id)
            };

            const res = await updateData({ path: "/role/manage-role", formData: payload });
            if (res?.success) {
                reset();
                setIsShow(false);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-5">
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
                <div>
                    <Controller
                        name="role"
                        control={control}
                        rules={{ required: "Role is required!!!" }}
                        render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                            <RHSelect
                                ref={(el) => {
                                    ref({ focus: () => el?.focus() });
                                }}
                                value={value}
                                onChange={onChange}
                                label="Select Role"
                                labelPosition='inline'

                                selectKey='role'

                                options={rolesData?.data?.roles}
                                required={true}
                                error={error?.message}
                                objectReturn={true}
                                isLoading={rolesLoading}

                                isMulti={true}
                                isClearable={true}
                            />
                        )}
                    />
                </div>

                <div className="flex justify-end items-center !mt-8">
                    <Button
                        variant="filled"
                        color="indigo"
                        size="md"
                        radius="md"
                        type="submit"
                        loading={isPending}
                    >
                        Assign Role
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AssignRoleForm;

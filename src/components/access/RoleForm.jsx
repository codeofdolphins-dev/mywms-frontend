import { Button } from '@mantine/core';
import React from 'react'
import { useForm } from 'react-hook-form';
import TextArea from '../inputs/TextArea';
import Input from '../inputs/Input';
import BooleanSwitch from '../inputs/BooleanSwitch';
import masterData from '../../Backend/master.backend';

const RoleForm = ({ setIsShow, editData = null, setEditData }) => {

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["allRole"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["allRole"]);

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
        defaultValues: {
            newRole: editData?.role || "",
            status: editData?.status || true,

        }
    });

    async function submitForm(data) {
        try {
            if (editData) {
                data.id = editData.id;
                const res = await updateData({ path: "/role/update-role", formData: data });
                if (res.success) {
                    reset();
                    setIsShow(false);
                    setEditData(null);
                }
            } else {
                const res = await createData({ path: "/role/add-role", formData: data });
                if (res.success) {
                    reset();
                    setIsShow(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form className="p-5" onSubmit={handleSubmit(submitForm)}>
                    <div className="flex flex-row gap-5">

                        <Input
                            label={"Role"}
                            placeholder={"Enter Role"}
                            {...register("newRole", { required: "This field is required!!!" })}
                            error={errors.newRole?.message}
                            required={true}
                        />

                        <BooleanSwitch
                            {...register("status", {
                                value: true
                            })}
                        />
                    </div>
                    <div className="mt-8 flex items-center justify-end gap-4">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false}>
                            {editData ? "Edit Role" : "Create Role"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RoleForm
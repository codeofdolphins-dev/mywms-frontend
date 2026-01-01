import { Button } from '@mantine/core';
import React from 'react'
import { useForm } from 'react-hook-form';
import TextArea from '../inputs/TextArea';
import Input from '../inputs/Input';

const RoleForm = ({ editId = null }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,

    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            parent_id: null

        }
    });

    function submitForm(data) {};

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form className="p-5" onSubmit={handleSubmit(submitForm)}>
                    <div className="flex flex-col gap-3">

                        <Input
                            type={"number"}
                            label={"Category"}
                            placeholder={"Enter category"}
                            {...register("name", { required: "This field is required!!!" })}
                            error={errors.name?.message}
                            required={true}
                        />

                        <TextArea
                            label={"Description"}
                            placeholder="Enter desc (optional)"
                            {...register("description")}
                        />
                    </div>
                    <div className="mt-8 flex items-center justify-end gap-4">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false}>
                            {editId ? "Edit Role" : "Create Role"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RoleForm
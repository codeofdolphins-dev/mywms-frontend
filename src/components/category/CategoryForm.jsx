import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import TextArea from '../inputs/TextArea';
import { Button } from '@mantine/core';
import RHSelect from "../inputs/RHF/Select.RHF"
import fetchData from '../../Backend/fetchData';
import master from '../../Backend/category.backend';


const CategoryForm = ({ setIsShow, data }) => {

    const { mutateAsync, isPending } = master.TQCreateMaster();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm();

    const submitForm = async (data) => {
        try {
            const res = await mutateAsync({ path: "/category/create", data });

            if (res.success) {
                reset();
                setIsShow(false);
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form className="p-5" onSubmit={handleSubmit(submitForm)}>
                    <div className="flex flex-col gap-3">

                        <Controller
                            name="parent_id"
                            control={control}
                            render={({ field: { value, onChange, ref } }) => (
                                <RHSelect
                                    ref={ref}
                                    value={value}
                                    onChange={onChange}

                                    label="Parent Category"
                                    options={data}
                                    placeholder='keep it empty if no parent category'
                                />
                            )}
                        />

                        <Input
                            type={"text"}
                            label={"Category"}
                            placeholder={"Enter category"}
                            {...register("name", { required: "This field is required!!!" })}
                            error={errors.name?.message}
                            required={true}
                        />
                        {/* <Input
                            type={"text"}
                            label={"Sub Category"}
                            placeholder={"Enter Sub-Category (optional)"}
                            {...register("subCategory")}
                        /> */}
                        <TextArea
                            label={"Description"}
                            placeholder="Enter desc (optional)"
                            {...register("description")}
                        />
                    </div>
                    <div className="mt-8 flex items-center justify-end gap-4">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={isPending}>Create Category</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CategoryForm
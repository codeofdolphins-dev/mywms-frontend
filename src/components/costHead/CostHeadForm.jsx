import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import TextArea from '../inputs/TextArea';
import { Button } from '@mantine/core';
import RHSelect from "../inputs/RHF/Select.RHF"
import masterData from '../../Backend/master.backend';
import FullScreenLoader from '../loader/FullScreenLoader';
import costFetch from '../../Backend/cost.fetch';


const CostHeadForm = ({ setIsShow, data = [], editId }) => {

    const { mutateAsync: create, isPending: isCreatePending } = masterData.TQCreateMaster(["costHeadList"]);
    const { mutateAsync: update, isPending: isUpdatePending } = masterData.TQUpdateMaster(["costHeadList"]);

    const { data: value, isLoading } = costFetch.TQCostHeadList({ id: editId }, !!editId);


    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            parent_id: null
        }
    });


    useEffect(() => {
        if (value?.[0]) {
            reset({
                name: value[0].name,
                description: value[0].description,
                parent_id: value[0].parent_id,
            })
        }
    }, [value, reset]);


    const submitForm = async (formData) => {
        try {
            let res = null;

            if (!editId) {
                res = await create({ path: "/cost-head/create", formData });
            } else {
                formData.id = editId;
                res = await update({ path: "/cost-head/update", formData });
            }


            if (res.success) {
                reset();
                setIsShow(false);
            }

        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) return <FullScreenLoader />;

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form className="p-5" onSubmit={handleSubmit(submitForm)}>
                    <div className="flex flex-col gap-3">

                        <Input
                            type="text"
                            label="Cost Head"
                            placeholder={"Enter cost head"}
                            {...register("name", { required: "This field is required!!!" })}
                            error={errors.name?.message}
                            required={true}
                            autoFocus={true}
                        />

                        <Controller
                            name="parent_id"
                            control={control}
                            render={({ field }) => (
                                <RHSelect
                                    {...field}

                                    label="Parent Cost Head (Optional)"
                                    options={data}
                                    placeholder='keep it empty if no parent cost head'
                                />
                            )}
                        />

                        <TextArea
                            label={"Description"}
                            placeholder="Enter desc (optional)"
                            {...register("description")}
                        />
                    </div>
                    <div className="mt-8 flex items-center justify-end gap-4">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={isCreatePending || isUpdatePending}>
                            {editId ? "Edit Category" : "Create Category"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CostHeadForm;
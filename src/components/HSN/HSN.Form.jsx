import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import { Button } from '@mantine/core';
import masterData from '../../Backend/master.backend';
import fetchData from '../../Backend/fetchData.backend';
import FullScreenLoader from '../loader/FullScreenLoader';
import BooleanSwitch from '../inputs/BooleanSwitch';
import RHRadioGroup from '../inputs/RHF/RHRadioGroup';
import TextArea from '../inputs/TextArea';


const HSNForm = ({ setIsShow, editId = null }) => {

    const { data: editData, isLoading } = fetchData.TQAllHsnList({ id: Number(editId) }, !!editId);
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["hsnList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["hsnList"]);

    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm({
        defaultValues: {
            code: "",
            default_gst_rate: "",
            cess_rate: "",
            is_exempt: false,
            effective_from: "",
            effective_to: "",
            description: ""
        }
    });

    useEffect(() => {
        if (!editData) return;
        const data = editData.data?.[0];

        setValue("code", data?.hsn_code);
        setValue("default_gst_rate", data?.default_gst_rate);
        setValue("cess_rate", data?.cess_rate);
        setValue("is_exempt", data?.is_exempt);
        setValue("effective_from", data?.effective_from);
        setValue("effective_to", data?.effective_to);
        setValue("description", data?.description);

    }, [editId, reset, editData]);

    const submit = async (data) => {
        try {

            if (editId) {
                data.id = editId;
                await updateData({ path: "/hsn/update", formData: data });
                reset();
                setIsShow(false);
            } else {
                await createData({ path: "/hsn/create", formData: data });
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
                <form onSubmit={handleSubmit(submit)} className="space-y-5">

                    {/* 1st row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* HSN Code */}
                        <div>
                            <Input
                                type="number"
                                label={"HSN Code"}
                                placeholder={"Enter HSN Code..."}
                                {...register("code", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.code?.message}
                                required={true}
                                autoFocus={true}
                            />
                        </div>

                        {/* HSN Rate */}
                        <div className=''>
                            <Input
                                label={"GST Rate %"}
                                placeholder={"Enter GST Rate..."}
                                {...register("default_gst_rate", {
                                    required: "This field is required!!!",
                                    pattern: {
                                        value: /^\d+(\.\d+)?$/,
                                        message: "Please enter a valid number (decimals allowed)",
                                    },
                                })}
                                error={errors.default_gst_rate?.message}
                                required={true}
                            />
                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* HSN Rate */}
                        <div className=''>
                            <Input
                                label={"CESS Rate % (if applicable)"}
                                placeholder={"Enter CESS Rate"}
                                {...register("cess_rate", {
                                    pattern: {
                                        value: /^\d+(\.\d+)?$/,
                                        message: "Please enter a valid number (decimals allowed)",
                                    },
                                })}
                                error={errors.cess_rate?.message}
                            />
                        </div>

                        <div className=''>
                            <Controller
                                name="is_exempt"
                                control={control}
                                defaultValue={false}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <RHRadioGroup
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}
                                        label="Tax exempt"
                                        options={[
                                            { label: "Yes", value: true },
                                            { label: "No", value: false },
                                        ]}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* HSN Rate */}
                        <div className=''>
                            <Input
                                type="date"
                                label={"Effective From"}
                                placeholder={"Enter CESS Rate..."}
                                {...register("effective_from")}
                            />
                        </div>

                        {/*  */}
                        <div className=''>
                            <Input
                                type="date"
                                label={"Effective To"}
                                placeholder={"Enter CESS Rate..."}
                                {...register("effective_to")}
                            />
                        </div>
                    </div>

                    {/* description */}
                    <div className="grid grid-cols-1 gap-4">
                        <TextArea
                            label="Description"
                            rows={1}
                            {...register("description")}
                        />
                    </div>


                    <div className="flex">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending} className='ml-auto'>
                            {editId ? "Update HSN" : "Create HSN"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HSNForm;

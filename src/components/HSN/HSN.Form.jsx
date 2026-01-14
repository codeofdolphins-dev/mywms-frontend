import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import { Button } from '@mantine/core';
import masterData from '../../Backend/master.backend';
import fetchData from '../../Backend/fetchData.backend';
import FullScreenLoader from '../loader/FullScreenLoader';
import BooleanSwitch from '../inputs/BooleanSwitch';


const HSNForm = ({ setIsShow, editId = null }) => {

    const { data: editData, isLoading } = fetchData.TQAllHsnList({ id: Number(editId) }, !!editId);
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["hsnList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["hsnList"]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        if (!editData) return;
        const data = editData.data?.[0];
        reset({
            code: data?.hsn_code,
            rate: data?.rate,
            status: data?.status
        });
    }, [editId, reset, editData]);

    const submit = async (data) => {
        try {

            if (editId) {
                data.id = editId;
                const res = await updateData({ path: "/hsn/update", formData: data });
                reset();
                setIsShow(false);
            } else {
                const res = await createData({ path: "/hsn/create", formData: data });
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
                    {/* 2nd row */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Email */}
                        <div>
                            <Input
                                label={"HSN Code"}
                                placeholder={"Enter HSN Code..."}
                                {...register("code", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.code?.message}
                                required={true}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-4">

                            {/* Password */}
                            <div className='col-span-9'>
                                <Input
                                    label={"HSN Rate %"}
                                    placeholder={"Enter Rate..."}
                                    {...register("rate", {
                                        required: "This field is required!!!"
                                    })}
                                    error={errors.rate?.message}
                                    required={true}
                                />
                            </div>
                            <div className="col-span-3">
                                <BooleanSwitch
                                    {...register("status", {
                                        value: true
                                    })}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="flex">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending} className='ml-auto'>
                            { editId ? "Update HSN" : "Create HSN" }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HSNForm;

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import { Button } from '@mantine/core';
import masterData from '../../Backend/master.backend';
import fetchData from '../../Backend/fetchData';
import FullScreenLoader from '../loader/FullScreenLoader';
import BooleanSwitch from '../inputs/BooleanSwitch';


const UnitTypeForm = ({ setIsShow, editId = null }) => {

    const { data: editData, isLoading } = fetchData.TQUnitTypeList({ id: Number(editId) }, !!editId);
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["unitTypeList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["unitTypeList"]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            name: "",
            isActive: true
        }
    });

    useEffect(() => {
        if (!editData) return;
        const data = editData.data?.[0];
        reset({
            name: data?.unit,
            isActive: data?.isActive
        });
    }, [editId, reset, editData]);

    const submit = async (data) => {
        try {

            if (editId) {
                data.id = editId;
                const res = await updateData({ path: "/unit/update", formData: data });
                reset();
                setIsShow(false);
            } else {
                const res = await createData({ path: "/unit/create", formData: data });
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
                        <div className="grid grid-cols-12 gap-4">

                            <div className='col-span-9'>
                                <Input
                                    label={"Unit Type"}
                                    placeholder={"Enter type..."}
                                    {...register("name", {
                                        required: "This field is required!!!"
                                    })}
                                    error={errors.name?.message}
                                    required={true}
                                />
                            </div>
                            <div className="col-span-3">
                                <BooleanSwitch
                                    {...register("isActive")}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-center items-center">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending}>
                            { editId ? "Update Unit Type" : "Create Unit Type" }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UnitTypeForm;

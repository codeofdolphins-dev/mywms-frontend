import { Button } from '@mantine/core'
import React, { useEffect } from 'react'
import FileUpload from '../inputs/File'
import { Controller, useForm } from 'react-hook-form'
import Input from '../inputs/Input'
import RHSelect from '../inputs/RHF/Select.RHF'
import TextArea from '../inputs/TextArea'
import fetchData from '../../Backend/fetchData'
import masterData from '../../Backend/master.backend'
import { RHFToFormData } from '../../utils/RHFtoFD'
import Loader from '../loader/Loader'


const Form = ({ editId = null, setIsShow }) => {

    const { data: editData, isLoading } = fetchData.TQAllBrandList({ id: editId }, !!editId);

    const { data: supplierData, isLoading: supplierLoading } = fetchData.TQAllSupplierList({ noLimit: true });
    const { mutateAsync: createData, isLoading: createLoading } = masterData.TQCreateMaster(["brand-all-list"]);
    const { mutateAsync: updateData, isLoading: updateLoading } = masterData.TQUpdateMaster("brand-all-list");

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (editData?.data?.[0]) {
            const data = editData?.data?.[0];

            reset({
                name: data?.name,
                suppliers: data?.suppliers?.map(item => item.id),
                website: data?.website,
                origin_country: data?.origin_country,
                description: data?.description,
            })
        }
    }, [editId]);

    const submit = async (data) => {
        try {
            const id = editId || null;

            if (id) {
                const formData = RHFToFormData(data);
                const res = await updateData({ path: "/brand/update", formData });
                reset();
                setIsShow(false);
            } else {
                const formData = RHFToFormData(data);
                const res = await createData({ path: "/brand/create", formData });
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
                {(isLoading || supplierLoading)
                    ? <Loader />
                    : <form onSubmit={handleSubmit(submit)} className="space-y-5">
                        {/* 1st row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label={"Brand Name"}
                                    placeholder={"Enter brand name..."}
                                    {...register("name", {
                                        required: "This field is required!!!"
                                    })}
                                    error={errors.name?.message}
                                    required={true}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="suppliers"
                                    control={control}
                                    rules={{
                                        required: "This field is required!!!"
                                    }}
                                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                        <RHSelect
                                            ref={(el) => {
                                                ref({
                                                    focus: () => el?.focus()
                                                });
                                            }}
                                            value={value}
                                            onChange={onChange}
                                            error={error?.message}

                                            label="Supplier"
                                            options={supplierData?.data}
                                            required={true}
                                            isMulti={true}
                                            selectKey={"full_name"}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* 2nd row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label={"Website"}
                                    placeholder={"Enter website URL (e.g., https://example.com)"}
                                    {...register("website")}
                                />
                            </div>
                            <div>
                                <Input
                                    label={"Origin Country"}
                                    placeholder={"Enter Origin Country (e.g., India)"}
                                    {...register("origin_country")}
                                />
                            </div>
                        </div>

                        {/* 3rd row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <TextArea
                                    label="Description"
                                    placeholder="Enter Description"
                                    className="text-sm"
                                    {...register("description")}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="logo"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange } }) => (
                                        <FileUpload
                                            label="Product Image"
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex">
                            <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false} className='ml-auto'>Create Brand</Button>
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}

export default Form

import { Button } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import FileUpload from '../inputs/File'
import { Controller, useForm } from 'react-hook-form'
import Input from '../inputs/Input'
import RHSelect from '../inputs/RHF/Select.RHF'
import TextArea from '../inputs/TextArea'
import fetchData from '../../Backend/fetchData.backend'
import masterData from '../../Backend/master.backend'
import { RHFToFormData } from '../../utils/RHFtoFD'
import Loader from '../loader/Loader'
import { FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import AddModal from '../Add.modal'
import SupplierForm from '../supplier/SupplierForm'


const Form = ({ editId = null, setIsShow = false }) => {
    const navigate = useNavigate()
    
    const [isSupplierPopup, setIsSupplierPopup] = useState(false);

    const { data: supplierData, isLoading: supplierLoading } = fetchData.TQAllSupplierList({ noLimit: true });

    const { data: editData, isLoading } = fetchData.TQAllBrandList({ id: editId }, !!editId);
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["brandList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["brandList"]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (!editData) return;

        const data = editData?.data?.[0];
        reset({
            name: data?.name,
            suppliers: data?.suppliers?.map(item => item.id),
            website: data?.website,
            origin_country: data?.origin_country,
            description: data?.description,
        })
    }, [editData]);

    const submit = async (data) => {
        console.log(data)
        try {

            if (editId) {
                data.id = editId;
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

    if (supplierLoading) return <Loader />;

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                {isLoading
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
                            <div className='flex items-center gap-5'>
                                <Controller
                                    name="vendor_id"
                                    control={control}
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

                                            label="Vendor"
                                            options={supplierData?.data}
                                            isMulti={true}
                                            selectKey={"name"}
                                            selectSubKey={"full_name"}
                                            className='w-full'

                                            disabled={true}

                                            addButton={true}
                                            buttonOnClick={() => setIsSupplierPopup(true)}
                                            buttonDisabled={true}
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
                            <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending} className='ml-auto'>
                                {editId ? "Update Brand" : "Create Brand"}
                            </Button>
                        </div>
                    </form>
                }
            </div>

            <AddModal
                isShow={isSupplierPopup}
                setIsShow={setIsSupplierPopup}
                title={"Add New Supplier"}
                maxWidth='60'
            >
                <SupplierForm
                    setIsShow={setIsSupplierPopup}
                />
            </AddModal>

        </div>
    )
}

export default Form

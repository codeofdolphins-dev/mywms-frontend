import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from '@/components/inputs/RHF/Select.RHF';
import TextArea from '@/components/inputs/TextArea';
import Input from '@/components/inputs/Input';
import FileUpload from '@/components/inputs/File';
import { Button } from '@mantine/core';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import RHRadioGroup from '@/components/inputs/RHF/RHRadioGroup';
import fetchData from '@/Backend/fetchData.backend';
import masterData from '@/Backend/master.backend';
import FullScreenLoader from '@/components/loader/FullScreenLoader';
import { useSelector } from 'react-redux';


const SupplierForm = ({
    setIsShow,
    editId
}) => {
    const navigate = useNavigate();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        mode: "onChange",
    });

    const state = watch("state");

    const stateData = useSelector(state => state.location);
    const { data: districtData } = fetchData.TQDistrictList(state?.id);

    const { data: supplierData, isLoading } = fetchData.TQAllSupplierList({ id: editId }, !!editId);

    const { mutateAsync: ceateSupplier, isPending: createIsPending } = masterData.TQCreateMaster(["supplierList"]);
    const { mutateAsync: updateSupplier, isPending: updateIsPending } = masterData.TQUpdateMaster(["supplierList"]);



    useEffect(() => {
        if (supplierData?.data?.[0]) {
            const data = supplierData?.data[0];

            reset({
                email: data?.contact_email,
                full_name: data?.name?.full_name,
                phone_no: data?.contact_phone,
                desc: data?.meta?.desc,

                address: data?.address?.address,
                district: data?.address?.district_id,
                state: data?.address?.state_id,
                pincode: data?.address?.pincode,
            })
        }
    }, [reset, supplierData, isLoading])

    async function submit(data) {
        try {
            if (editId) {
                data.id = editId;

                const res = await updateSupplier({ path: "/supplier/update", formData: data });
                if (res.success) {
                    reset();
                    setIsShow(false);
                }

            } else {
                const res = await ceateSupplier({ path: "/supplier/create", formData: data });
                if (res.success) {
                    reset();
                    setIsShow(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) return <FullScreenLoader />;

    return (
        <div>
            {/* Grid */}
            <div className="panel mt-5" id="forms_grid">
                <form onSubmit={handleSubmit(submit)} className="space-y-5">

                    {/* 1st row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Email */}
                        <Input
                            label={"Email"}
                            placeholder={"Enter Email..."}
                            {...register("email", {
                                required: "This field is required!!!"
                            })}
                            error={errors.email?.message}
                            required={true}
                            disabled={editId}
                        />

                        {/* Full Name */}
                        <Input
                            label={"Full Name"}
                            placeholder={"Enter Full Name..."}
                            {...register("full_name", {
                                required: "This field is required!!!"
                            })}
                            error={errors.full_name?.message}
                            required={true}
                        />

                        {/* Phone Number */}
                        <Input
                            label={"Phone Number"}
                            type="number"
                            placeholder={"Enter Phone Number..."}
                            {...register("phone_no", {
                                required: "This field is required!!!"
                            })}
                            error={errors.phone_no?.message}
                            required={true}
                        />


                        {/* Address */}
                        <Input
                            label="Address"
                            placeholder="Enter Address..."
                            className="text-sm"
                            {...register("address", {
                                required: "This field is required!!!"
                            })}
                            required={true}
                            error={errors.address?.message}
                        />

                        {/* Pincode */}
                        <Input
                            label={"Pincode"}
                            type={"number"}
                            placeholder={"Enter Pincode"}
                            {...register("pincode", { required: "This field is required!!!" })}
                            error={errors.pincode?.message}
                            required={true}
                        />

                        {/* State */}
                        <Controller
                            name="state"
                            control={control}
                            rules={{
                                required: "This field is required!!!"
                            }}
                            render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}

                                    label="Select State"
                                    options={stateData}
                                    required={true}
                                    error={error?.message}
                                    objectReturn={true}
                                />
                            )}
                        />

                        {/* district */}
                        <Controller
                            name="district"
                            control={control}
                            rules={{
                                required: "This field is required!!!"
                            }}
                            render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}

                                    label="Select district"
                                    options={districtData}
                                    required={true}
                                    error={error?.message}
                                    disabled={state ? false : true}
                                    objectReturn={true}
                                />
                            )}
                        />

                        {/* 5th row */}
                        <TextArea
                            label="Description"
                            placeholder="Enter Address..."
                            className="text-sm"
                            {...register("desc")}
                        />
                    </div>

                    <div className="flex">
                        <button
                            type='button'
                            className='btn btn-outline-dark'
                            onClick={() => {
                                reset();
                                navigate(-1);
                            }}
                        >
                            Cancel
                        </button>
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createIsPending || updateIsPending} className='ml-auto'>
                            {editId ? "Update Supplier" : "Add Supplier"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SupplierForm

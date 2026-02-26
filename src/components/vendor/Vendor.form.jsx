import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../inputs/Input';
import { Button } from '@mantine/core';
import masterData from '../../Backend/master.backend';
import RHSelect from "../../components/inputs/RHF/Select.RHF"
import vendor from '../../Backend/vendor.backend';
import AddModal from '../Add.modal';
import VendorCategoryForm from './VendorCategory.form';

const VendorForm = ({ editId = null, setIsShow }) => {
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["vendorList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["vendorList"]);

    const { data: vendorCategory, isLoading: vendorCategoryLoading } = vendor.TQVendorCategoryList({ noLimit: true });

    const [isModalShow, setModalShow] = useState(false);


    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
        defaultValues: {
            email: "",
            password: "",
            full_name: "",
            phone: "",
            company_name: "",
            gst_no: "",
            vendor_category_id: ""
        }
    });


    async function submit(data) {
        // console.log(data); return

        try {
            if (editId == null) {
                const res = await createData({ path: "/auth/register-vendor", formData: data });
                if (res.success) {
                    setIsShow(false);
                    reset();
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form onSubmit={handleSubmit(submit)} className="space-y-3">

                    {/* 1st row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label={"Full Name"}
                                placeholder={"Enter full name..."}
                                {...register("full_name", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.full_name?.message}
                                required={true}
                            />
                        </div>
                        <div>
                            <Input
                                label={"Contact Number"}
                                placeholder={"Enter number..."}
                                {...register("phone")}
                            />
                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label={"Email"}
                                placeholder={"Enter name..."}
                                {...register("email", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.email?.message}
                                required={true}
                            />
                        </div>
                        <div>
                            <Input
                                label={"Password"}
                                placeholder={"Enter password..."}
                                {...register("password", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.password?.message}
                                required={true}
                            />
                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Controller
                                name="vendor_category_id"
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

                                        label="Category"
                                        options={vendorCategory?.data}
                                        required={true}
                                        error={error?.message}

                                        addButton={true}
                                        buttonOnClick={() => setModalShow(true)}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Input
                                label={"GST"}
                                placeholder={"Enter gst no..."}
                                {...register("gst_no")}
                            />
                        </div>
                        {/* </div> */}

                        {/* 4th row */}
                        <div>
                            <Input
                                label="Company Name"
                                placeholder="Enter company name..."
                                {...register("company_name")}
                            />
                        </div>
                    </div>


                    <div className="flex justify-end items-center !mt-10">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending}>
                            {editId ? "Update" : "Submit"}
                        </Button>
                    </div>
                </form>
            </div>

            <AddModal
                isShow={isModalShow}
                setIsShow={setModalShow}
                title="Add New Vendor"
                maxWidth='50'
            >
                <VendorCategoryForm
                    setIsShow={setModalShow}
                />
            </AddModal>
        </div>
    )
}

export default VendorForm
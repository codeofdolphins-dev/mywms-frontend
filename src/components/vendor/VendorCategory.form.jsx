import { Button } from '@mantine/core';
import React from 'react'
import Input from '../inputs/Input';
import { useForm } from 'react-hook-form';
import masterData from '../../Backend/master.backend';
import TextArea from '../inputs/TextArea';

const VendorCategoryForm = ({ editData = null, setIsShow }) => {
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["vendorCategoryList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["vendorCategoryList"]);

    const { handleSubmit, register, formState: { errors }, reset } = useForm({ defaultValues: {
        name: editData?.name || "",
        desc: editData?.desc || ""
    } });


    async function submit(data) {
        try {            
            if(!editData){
                const res = await createData({ path: "/vendor/category/create", formData: data });
                if(res.success){
                    setIsShow(false);
                    reset();
                }
            }else{
                data.id = editData?.id;
                const res = await updateData({ path: "/vendor/category/update", formData: data });
                if(res.success){
                    setIsShow(false);
                    reset();
                }                
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form onSubmit={handleSubmit(submit)} className="space-y-3">

                    {/* 1st row */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Input
                                label={"Vendor Category"}
                                placeholder={"Enter vendor category..."}
                                {...register("name", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.name?.message}
                                required={true}
                            />
                        </div>
                        <div>
                            <TextArea
                                label="Description"
                                placeholder='Description...'
                                {...register("desc")}
                            />
                        </div>
                    </div>


                    <div className="flex justify-end items-center !mt-10">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending}>
                            {editData ? "Update" : "Submit"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VendorCategoryForm
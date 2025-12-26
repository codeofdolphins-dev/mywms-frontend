import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import { Button } from '@mantine/core';
import masterData from '../../Backend/master.backend';


const CreateHSNForm = ({ setIsShow }) => {

    const { mutateAsync: createData, isPending } = masterData.TQCreateMaster()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const submit = async (data) => {
        try {
            
            if (false) {
            } else {
                const res = await createData({ path: "/hsn/create", formData: data });
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

                        {/* Password */}
                        <div>
                            <Input
                                label={"HSNRate %"}
                                placeholder={"Enter Rate..."}
                                {...register("rate", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.rate?.message}
                                required={true}
                            />
                        </div>
                    </div>


                    <div className="flex">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={isPending} className='ml-auto'>Create HSN</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateHSNForm;

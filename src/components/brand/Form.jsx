import { Button } from '@mantine/core'
import React from 'react'
import FileUpload from '../inputs/File'
import { Controller, useForm } from 'react-hook-form'
import Input from '../inputs/Input'
import RHSelect from '../inputs/RHF/Select.RHF'
import TextArea from '../inputs/TextArea'

const gstType = [
    { value: "include", label: "Shoes" },
    { value: "exclude", label: "Hats" },
]

const Form = () => {

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submit = (data) => {
        console.log(data);
    }

    return (
        <div>
            {/* Grid */}
            <div className="panel" id="forms_grid">
                <div className="mb-5">
                    <form onSubmit={handleSubmit(submit)} className="space-y-5">
                        {/* 2nd row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label={"Brand Name"}
                                    placeholder={"Enter brand name..."}
                                    {...register("brand", {
                                        required: "This field is required!!!"
                                    })}
                                    error={errors.brand?.message}
                                    required={true}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="supplier"
                                    control={control}
                                    render={({ field }) => (
                                        <RHSelect
                                            label="Supplier"
                                            options={gstType}
                                            value={field.value}
                                            onChange={field.onChange}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* 3rd row */}
                        <div className="grid grid-cols-1">
                            <div>
                                <TextArea
                                    label="Description"
                                    placeholder="Enter Description"
                                    className="text-sm"
                                    {...register("desc")}
                                />
                            </div>
                        </div>

                        {/* 4th row */}
                        <div className="grid grid-cols-1">
                            <div>
                                <Input
                                    label={"Website"}
                                    placeholder={"Enter website URL (e.g., https://example.com)"}
                                    {...register("url")}
                                />
                            </div>
                        </div>

                        {/* 5th row */}
                        <div className="grid grid-cols-1">
                            <div>
                                <Input
                                    label={"Origin Country"}
                                    placeholder={"Enter Origin Country (e.g., India)"}
                                    {...register("country")}
                                />
                            </div>
                        </div>

                        {/* 6th row */}
                        {/* file upload */}
                        <div className="grid grid-cols-1">
                            <Controller
                                name="productImage"
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

                        <div className="flex">
                            <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false} className='ml-auto'>Add Product</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Form

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../inputs/Input';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../inputs/RHF/Select.RHF";
import { debounce } from 'lodash';
import fetchData from '../../../Backend/fetchData.backend';
import { Button } from '@mantine/core';
import TextArea from '../../inputs/TextArea';
import masterData from '../../../Backend/master.backend';

const RequisitionCategoryForm = ({
    setIsShow,
}) => {
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["requisitionCategoryList"]);

    const { handleSubmit, register, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            desc: ""
        }
    });

    async function submitForm(data) {
        try {
            const res = await createData({ path: "/requisition-category/create", formData: data });

            if (res?.success) {
                reset();
                setIsShow(false);
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="panel" id="forms_grid">

            <form onSubmit={handleSubmit(submitForm)}>
                {/* form */}
                <div className='space-y-5'>

                    {/* 1st */}
                    <div className="grid grid-cols-1 gap-5">
                        {/* barcode */}
                        <div>
                            <Input
                                label="Category"
                                placeholder="Enter category"
                                {...register("name", {
                                    required: "category required"
                                })}
                                error={errors.name?.message}
                                required={true}
                            />
                        </div>

                        {/* product name */}
                        <div>
                            <TextArea
                                label="Description"
                                {...register("desc")}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-10">
                        <button
                            className='btn btn-outline-dark'
                            onClick={() => reset()}
                            type='button'
                        >Reset</button>
                        <Button
                            type="submit"
                            className="btn btn-primary"
                        // disabled={isAlreadySelected || !product}
                        // loading={isLoading}
                        >
                            Add Item
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RequisitionCategoryForm;
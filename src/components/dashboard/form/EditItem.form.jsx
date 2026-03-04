import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../inputs/Input';
import { Button } from '@mantine/core';
import { currencyFormatter } from '../../../utils/currencyFormatter';

const EditItemForm = ({
    setIsEditItem,
    data = null,
}) => {
    const { handleSubmit, register, reset, formState: { errors } } = useForm({
        defaultValues: {
            p_name: data?.product_name ?? "",
            qty: `${data?.qty} ${data?.uom}`,
            price: currencyFormatter(data?.price_limit) ?? "",
            offer_price: data?.offer_price ?? "",
        }
    });
    // console.log(data)

    function submitForm(item) {
        data.offer_price = item.offer_price
        data.line_total = Number(data.qty) * Number(item.offer_price)
        setIsEditItem(false);
    }

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form className="p-5 space-y-3" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Product Name"
                            placeholder={"product name"}
                            // labelPosition="inline"
                            {...register("p_name")}
                            disabled={true}
                        />
                        <Input
                            label="Requested Qty"
                            placeholder={"qty"}
                            // labelPosition="inline"
                            {...register("qty")}
                            error={errors.p_name?.message}
                            disabled={true}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Price"
                            placeholder={"price"}
                            // labelPosition="inline"
                            {...register("price")}
                            disabled={true}
                        />
                        <Input
                            label="Your Price"
                            placeholder="Enter your price"
                            // labelPosition="inline"
                            {...register("offer_price", { required: "Offer Price field is required!!!" })}
                            error={errors.offer_price?.message}
                            required={true}
                        />
                    </div>
                    <div className="mt-8 flex items-center justify-end gap-4">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit"
                        // loading={isCreatePending || isUpdatePending}
                        >
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditItemForm
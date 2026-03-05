import { Button } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { currencyFormatter } from '../../utils/currencyFormatter';
import Input from '../inputs/Input';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import masterData from '../../Backend/master.backend';
import { utcToLocal } from '../../utils/UTCtoLocal';
import IconPencil from '../Icon/IconPencil';
import CustomeButton from "../inputs/Button"

const RFQPreview = ({
    details,
    setIsRequisitionCardShow,
    setIsPreviewCardShow,
    setIsShowPreviewEX
}) => {
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["rfqQuotationList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["rfqQuotationList"]);

    const [allowEdit, setAllowEdit] = useState(false);

    const { handleSubmit, register, setValue, reset, control, watch } = useForm({
        defaultValues: {
            grandTotal: currencyFormatter(details?.grand_total) ?? "",
            valid_till: details?.valid_till ?? "",
            items: []
        }
    });

    const isEditable = details?.quotationItems === undefined ? false : true;

    const { fields } = useFieldArray({
        control,
        name: "items"
    });

    /** prepare form for multiple items DYNAMIC */
    useEffect(() => {
        if (details.items?.length) {
            const items = details.items.map(item => ({
                id: item?.id,
                qty: item?.qty,
                product_name: item?.product_name,
                uom: item?.uom,
                price_limit: item?.price_limit,
                offer_price: item?.offer_price ?? "",
                line_total: ""
            }));
            reset({ items });
        }

        if (details.quotationItems?.length) {
            const items = details.quotationItems.map(item => ({
                rfq_item_id: item?.rfq_item_id,
                qty: item?.sourceRfqItem?.qty,
                product_name: item?.sourceRfqItem?.product_name,
                uom: item?.sourceRfqItem?.uom,
                price_limit: item?.sourceRfqItem?.price_limit,
                offer_price: item?.offer_price ?? "",
                line_total: ""
            }));
            reset({ items });
        }
    }, [details, reset]);


    const items = useWatch({
        control,
        name: "items"
    });

    useEffect(() => {
        if (!items?.length) return;

        let grandTotal = 0;

        items.forEach((item, index) => {
            const qty = Number(item.qty) || 0;
            const offerPrice = Number(item.offer_price) || 0;
            const lineTotal = qty * offerPrice;

            grandTotal += lineTotal;
        });

        setValue("grandTotal", grandTotal, {
            shouldDirty: false,
            shouldValidate: false
        });

    }, [items, setValue]);

    async function submit(data) {
        // console.log(data);

        try {
            if (isEditable && allowEdit) {
                data.id = details?.id;

                console.log(data);
                alert("🛑 Under process!!!");

                // const res = await updateData({ path: "", formData: data });

                if (res.success) {
                    reset();
                    setIsShowPreviewEX(false);
                }
            } else {
                data.rfq_no = details?.rfq_no;
                data.buyer_name = `${details?.name} - ${details?.location}`

                const res = await createData({ path: "/rfq/quotation/create", formData: data });

                // console.log(res)

                if (res.success) {
                    reset();
                    setIsRequisitionCardShow(false);
                    setIsPreviewCardShow(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log(details)

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-1 mb-4">
                    <div className='space-y-1'>
                        <p className="text-xl">{details?.name ?? details?.buyer_name} - {details?.location} </p>
                        <p className="text-sm text-gray-500"># {details?.rfq_no ?? details?.linkedRfq?.rfq_no}</p>
                    </div>
                    <span
                        className={`px-3 py-1 text-sm font-semibold rounded 
                            ${details?.priority?.toLowerCase() === "high"
                                ? "bg-red-100 text-red-700"
                                : details?.priority?.toLowerCase() === "normal"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700 invisible"
                            }
                        `}
                    >
                        {details?.priority}
                    </span>
                </div>

                {/* Note */}
                {details?.note && (
                    <div className="my-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Note:</span> {details?.note}
                        </p>
                    </div>
                )}

                <div id='forms_grid' className="my-4">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="">
                            <Input
                                label="Grand Total"
                                placeholder='grand total'
                                labelPosition="inline"
                                {...register("grandTotal")}
                                disabled={true}
                            />
                        </div>
                        <div className="">
                            <Input
                                type='date'
                                label="Valide Till"
                                labelPosition="inline"
                                {...register("valid_till")}
                            />
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-700">Items</h3>
                        {isEditable &&
                            <CustomeButton
                                onClick={() => setAllowEdit(prev => !prev)}
                            >
                                <IconPencil className="text-danger w-4 h-4 hover:scale-110 cursor-pointer" />
                            </CustomeButton>
                        }
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="border border-gray-200 px-4 py-2 text-left">Product</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Qty</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">UOM</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Price Limit</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Your Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields?.map((field, idx) => {

                                    return <tr key={idx}>
                                        <td className="border border-gray-200 px-4 py-2">{field?.product_name}</td>
                                        <td className="border border-gray-200 px-4 py-2">{field?.qty}</td>
                                        <td className="border border-gray-200 px-4 py-2">{field?.uom}</td>
                                        <td className="border border-gray-200 px-4 py-2">{currencyFormatter(field?.price_limit)}</td>
                                        <td className="border border-gray-200 ">
                                            {isEditable
                                                ? allowEdit
                                                    ? <Input
                                                        placeholder="Enter your price"
                                                        {...register(`items.${idx}.offer_price`)}
                                                    />
                                                    : currencyFormatter(field?.offer_price)
                                                : <Input
                                                    placeholder="Enter your price"
                                                    {...register(`items.${idx}.offer_price`)}
                                                />
                                            }
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isEditable
                    ? allowEdit
                        ? <div className="mt-5 flex items-center justify-center">
                            <Button
                                type='submit'
                            // disabled={details?.items?.some(i => i?.offer_price === undefined)}
                            >
                                Update
                            </Button>
                        </div>
                        : null
                    : <div className="mt-5 flex items-center justify-center">
                        <Button
                            type='submit'
                        // disabled={details?.items?.some(i => i?.offer_price === undefined)}
                        >
                            Submit
                        </Button>
                    </div>
                }
            </div>
        </form>
    )
}

export default RFQPreview
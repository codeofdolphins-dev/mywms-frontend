import { Button } from '@mantine/core'
import React, { useEffect } from 'react'
import { currencyFormatter } from '../../utils/currencyFormatter';
import Input from '../inputs/Input';
import { useForm } from 'react-hook-form';

const RFQPreview = ({ details }) => {
    const { handleSubmit, register, setValue } = useForm()

    const grand_total = details?.items?.reduce((total, i) => total + i.line_total, 0);

    useEffect(() => {
        setValue("g_total", currencyFormatter(grand_total))
    }, [grand_total])

    async function submit(data) {
        details = { ...details, ...data }
        console.log(details)
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-1 mb-4">
                    <div className='space-y-1'>
                        <p className="text-xl">{details?.name} - {details?.location} </p>
                        <p className="text-sm text-gray-500"># {details?.rfq_no}</p>
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
                                {...register("g_total")}
                            />
                        </div>
                        <div className="">
                            <Input
                                type='date'
                                label="Valide Till"
                                labelPosition="inline"
                                placeholder='grand total'
                                {...register("valid_till")}
                            />
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Items</h3>
                    <div className="max-h-40 overflow-y-auto">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="border border-gray-200 px-4 py-2 text-left">Product</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Qty</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">UOM</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Price Limit</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Your Price</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details?.items?.map(item => {

                                    return <tr key={item.id}>
                                        <td className="border border-gray-200 px-4 py-2">{item?.product_name}</td>
                                        <td className="border border-gray-200 px-4 py-2">{item?.qty}</td>
                                        <td className="border border-gray-200 px-4 py-2">{item?.uom}</td>
                                        <td className="border border-gray-200 px-4 py-2">{currencyFormatter(item?.price_limit)}</td>
                                        <td className="border border-gray-200 px-4 py-2">{currencyFormatter(item?.offer_price)}</td>
                                        <td className="border border-gray-200 px-4 py-2">{currencyFormatter(item?.line_total)}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-center">
                    <Button
                        type='submit'
                        disabled={details?.items?.some(i => i?.offer_price === undefined)}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default RFQPreview
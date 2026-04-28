import { Button } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { currencyFormatter } from '../../utils/currencyFormatter';
import Input from '../inputs/Input';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import masterData from '../../Backend/master.backend';
import { utcToLocal } from '../../utils/UTCtoLocal';
import IconPencil from '../Icon/IconPencil';
import CustomeButton from "../inputs/Button"
import { FiFileText, FiPackage, FiCheckCircle, FiEdit3 } from 'react-icons/fi';
import fetchData from '../../Backend/fetchData.backend';
import RHSelect from '../../components/inputs/RHF/Select.RHF';


const RFQPreview = ({
    details,
    setIsRequisitionCardShow,
    setIsPreviewCardShow,
    setIsShowPreviewEX
}) => {
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["rfqQuotationList", "appliedRfqList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["rfqQuotationList", "appliedRfqList"]);

    const { data: productList, isLoading } = fetchData.TQProductList({ type: "finished" });

    const [allowEdit, setAllowEdit] = useState(false);


    const { handleSubmit, register, setValue, reset, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            grandTotal: currencyFormatter(details?.grand_total) ?? "",
            valid_till: details?.valid_till ?? "",
            items: []
        }
    });
    const isEditable = details?.quotationRevision?.revisionItems === undefined ? false : true;


    const { fields } = useFieldArray({
        control,
        name: "items"
    });


    /** prepare form for multiple items DYNAMIC */
    useEffect(() => {
        // for create purpose
        if (details.items?.length) {
            const items = details.items.map(item => ({
                rfq_item_id: item?.id,
                qty: item?.qty,
                product_name: item?.product_name,
                uom: item?.uom,
                price_limit: item?.price_limit,
                offer_price: item?.offer_price ?? "",
                supplier_product_id: item?.vendor_product?.id ?? null,
                // vendor_product: item?.vendor_product
            }));
            reset({ items });
        }
        // for preview and edit purpose
        if (details?.quotationRevision?.revisionItems?.length) {
            const items = details?.quotationRevision?.revisionItems.map(item => ({
                rfq_item_id: item?.rfq_item_id,
                qty: item?.sourceRfqItem?.qty,
                product_name: item?.sourceRfqItem?.product_name,
                uom: item?.sourceRfqItem?.uom,
                price_limit: item?.sourceRfqItem?.price_limit,
                offer_price: item?.offer_price ?? "",
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
        // console.log(data); return
        // console.log(details); return
        try {
            if (isEditable && allowEdit) {
                data.quotation_id = details?.id;
                // console.log(data); return
                const res = await updateData({ path: "/rfq/quotation/update", formData: data });
                if (res.success) {
                    reset();
                    setIsShowPreviewEX(false);
                }
            } else {
                data.rfq_no = details?.rfq_no;
                data.buyer_name = `${details?.name} - ${details?.location}`
                // console.log(data); return
                const res = await createData({ path: "/rfq/quotation/create", formData: data });
                if (res.success) {
                    reset();
                    setIsRequisitionCardShow(false);
                    setIsPreviewCardShow(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // console.log(details);


    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="bg-white rounded-2xl p-0 pb-5 overflow-hidden relative shadow-sm">

                {/* Header Area with modern gradient banner */}
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50 px-6 py-4">
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex gap-4 items-start w-full">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center p-1 relative z-20 overflow-hidden shrink-0">
                                <div className="text-blue-600 opacity-80">
                                    <FiFileText size={28} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                    <h2 className="text-xl font-bold leading-tight text-gray-800">
                                        {details?.name ? `${details?.name}` : details?.buyer_name}
                                    </h2>
                                    {details?.priority && (
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${details?.priority?.toLowerCase() === "high"
                                                ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                                                : details?.priority?.toLowerCase() === "normal"
                                                    ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                                                    : "bg-gray-100 text-gray-700 shadow-sm invisible"
                                                }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${details?.priority?.toLowerCase() === "high" ? "bg-red-500" :
                                                details?.priority?.toLowerCase() === "normal" ? "bg-blue-500" : "bg-gray-500"
                                                }`}></div>
                                            {details?.priority}
                                        </span>
                                    )}
                                    {isEditable && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">{details?.quotationRevision?.status?.toUpperCase()}</span>}
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                        <span className="shrink-0 text-gray-400">#</span> {details?.rfq_no ?? details?.linkedRfq?.rfq_no}
                                    </p>
                                    {isEditable && <p className="text-xs font-bold text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded flex items-center gap-1"><IconPencil className="w-3 h-3" /> Rev: {details?.quotationRevision?.revision_no}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative background pattern */}
                    <div className="absolute right-2 bottom-0 opacity-20 blur-sm transform translate-y-1/2 translate-x-1/4 text-gray-600">
                        <FiCheckCircle size={120} />
                    </div>
                </div>

                <div className="px-6 mt-2 bg-gray-50/50">

                    {/* remarks */}
                    {details?.quotationRevision?.remarks && (
                        <div className="mb-3 bg-amber-50 border border-amber-200 shadow-sm py-2 px-4 rounded-xl flex gap-3 items-start relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                            <div className="text-amber-500 mt-0.5">
                                <FiFileText size={18} />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 block mb-1">Negotiation Remark:</span>
                                <p className="text-sm font-medium leading-relaxed text-amber-900/80">
                                    {details?.quotationRevision?.remarks}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* price breakup */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <Input
                                label="Grand Total"
                                placeholder='grand total'
                                labelPosition="inline"
                                {...register("grandTotal")}
                                disabled={true}
                                className="!mb-0"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <Input
                                type='date'
                                label="Valide Till"
                                labelPosition="inline"
                                {...register("valid_till", { required: "date required!!!" })}
                                disabled={isEditable}
                                className="!mb-0"
                                required={true}
                                error={errors?.valid_till?.message}
                            />
                        </div>
                    </div>

                    {/* Items Custom UI instead of table */}
                    <div className="mt-5 py-4 px-2 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <FiPackage className="text-blue-500 w-5 h-5" />
                                <h3 className="text-sm font-bold text-gray-700 tracking-wide">Quotation Items</h3>
                                <div className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200 ml-2 shadow-sm">{fields?.length}</div>
                            </div>
                            {(isEditable && details?.quotationRevision?.status === "negotiate") && (
                                <button
                                    type="button"
                                    onClick={() => setAllowEdit(prev => !prev)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${allowEdit ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <FiEdit3 size={14} />
                                    {allowEdit ? "Editing" : "Edit Details"}
                                </button>
                            )}
                        </div>

                        <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-3 mt-3">
                                {fields?.map((field, idx) => {
                                    return (
                                        <div key={idx} className="group bg-white border border-gray-100 rounded-xl py-2 px-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-semibold text-gray-800 text-sm block mb-1 truncate">{field?.product_name}</span>
                                                        <div className="flex items-center gap-3 text-xs flex-wrap">
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="text-gray-400 mr-1 font-medium uppercase tracking-wider text-[10px]">Qty:</span>
                                                                <span className="font-bold">{field?.qty}</span>
                                                                <span className="ml-1">{field?.uom}</span>
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="text-gray-400 mr-1 font-medium uppercase tracking-wider text-[10px]">Limit:</span>
                                                                <span className="font-medium">{currencyFormatter(field?.price_limit)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end w-1/2 gap-4">

                                                    {/* Choose your product */}
                                                    {!isEditable &&
                                                        <div className="w-full whitespace-nowrap">
                                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                                                Choose your product
                                                                <span className='text-danger text-sm'> *</span>
                                                            </label>
                                                            <div className="">
                                                                <Controller
                                                                    name={`items.${idx}.supplier_product_id`}
                                                                    control={control}
                                                                    rules={{
                                                                        required: "This field is required!!!"
                                                                    }}
                                                                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                                        <RHSelect
                                                                            ref={(el) => {
                                                                                ref({
                                                                                    focus: () => el?.focus(),
                                                                                });
                                                                            }}
                                                                            value={value}
                                                                            onChange={onChange}

                                                                            options={productList?.data?.filter(product => {
                                                                                return !items?.some((item, i) => i !== idx && item?.supplier_product_id === product.id);
                                                                            })}
                                                                            error={errors?.items?.[idx]?.supplier_product_id?.message || error?.message}
                                                                            required={true}
                                                                            isClearable={true}
                                                                            disabled={!!details?.items?.[idx]?.vendor_product}
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    }

                                                    {/* Your Price */}
                                                    <div className={`whitespace-nowrap ${!isEditable ? "w-full" : ""}`}>
                                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Your Price / {field?.uom}</label>
                                                        {isEditable
                                                            ? allowEdit
                                                                ? <Input
                                                                    placeholder="Enter price"
                                                                    className="!mb-0"
                                                                    {...register(`items.${idx}.offer_price`)}
                                                                />
                                                                : <div className="w-36 font-bold text-lg text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                                    {currencyFormatter(field?.offer_price)}
                                                                </div>
                                                            : <Input
                                                                placeholder="Enter price"
                                                                className="!mb-0"
                                                                {...register(`items.${idx}.offer_price`)}
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {isEditable ? (
                        allowEdit && (
                            <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-end">
                                <Button
                                    type='submit'
                                    className="btn btn-primary shadow-md hover:shadow-lg transition-shadow"
                                >
                                    Update Requisition
                                </Button>
                            </div>
                        )
                    ) : (
                        <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-end">
                            <Button
                                type='submit'
                                className="btn btn-primary shadow-md hover:shadow-lg transition-shadow"
                            >
                                Submit Proposal
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}
export default RFQPreview
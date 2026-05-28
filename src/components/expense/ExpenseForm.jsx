import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import { Button } from '@mantine/core';
import masterData from '../../Backend/master.backend';
import costFetch from '../../Backend/cost.fetch';
import FullScreenLoader from '../loader/FullScreenLoader';
import RHRadioGroup from '../inputs/RHF/RHRadioGroup';
import RHSelect from '../inputs/RHF/Select.RHF';
import TextArea from '../inputs/TextArea';

const ExpenseForm = ({ setIsShow, editId = null }) => {

    const { data: costHeads, isLoading: headsLoading } = costFetch.TQCostHeadList({ noLimit: true, isAdmin: true });
    const { data: editData, isLoading: editLoading } = costFetch.TQCostCenterList({ id: Number(editId) }, !!editId);

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["costCenterList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["costCenterList"]);

    const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm({
        defaultValues: {
            costHead_id: null,
            costSubHead_id: null,
            type: "monthly",
            amount: "",
            cost_date: new Date().toISOString().split('T')[0],
            remarks: ""
        }
    });

    useEffect(() => {
        if (!editData) return;
        const data = editData.data?.[0];
        if (!data) return;

        reset({
            costHead_id: data.costHead_id,
            costSubHead_id: data.costSubHead_id,
            type: data.type,
            amount: String(data.amount),
            cost_date: data.cost_date ? data.cost_date.split('T')[0] : new Date().toISOString().split('T')[0],
            remarks: data.remarks || ""
        });

    }, [editId, editData, reset]);

    const selectedCostHeadId = watch("costHead_id");
    const subCostHeads = costHeads?.find(h => h.id === selectedCostHeadId)?.subCostCategories || [];

    const submit = async (data) => {
        try {
            const formData = {
                costHead_id: Number(data.costHead_id),
                costSubHead_id: data.costSubHead_id ? Number(data.costSubHead_id) : null,
                type: data.type,
                amount: String(data.amount),
                cost_date: data.cost_date || new Date().toISOString().split('T')[0],
                remarks: data.remarks || ""
            };

            if (editId) {
                formData.id = editId;
                await updateData({ path: "/cost-center/update", formData });
                reset();
                setIsShow(false);
            } else {
                await createData({ path: "/cost-center/create", formData });
                reset();
                setIsShow(false);
            }

        } catch (error) {
            console.log(error);
        }
    }

    if (headsLoading || (editId && editLoading)) return <FullScreenLoader />;

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form onSubmit={handleSubmit(submit)} className="space-y-5">

                    {/* 1st row: Cost Head & Cost Sub Head */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Controller
                                name="costHead_id"
                                control={control}
                                rules={{ required: "Cost Head is required!!!" }}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <RHSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={(val) => {
                                            onChange(val);
                                            setValue("costSubHead_id", null);
                                        }}
                                        label="Cost Head"
                                        options={costHeads || []}
                                        error={error?.message}
                                        required={true}
                                        placeholder="Select Cost Head..."
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="costSubHead_id"
                                control={control}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <RHSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}
                                        label="Cost Sub Head"
                                        options={subCostHeads}
                                        error={error?.message}
                                        disabled={!selectedCostHeadId}
                                        placeholder={selectedCostHeadId ? "Select Cost Sub Head..." : "Select Cost Head first"}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* 2nd row: Cost Type & Amount */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: "Cost Type is required!!!" }}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <RHRadioGroup
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}
                                        label="Cost Type"
                                        options={[
                                            { label: "Monthly", value: "monthly" },
                                            { label: "One-Time", value: "onetime" },
                                            { label: "Yearly", value: "yearly" },
                                        ]}
                                        error={error?.message}
                                        required={true}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Input
                                label="Amount"
                                type="number"
                                step="0.01"
                                placeholder="Enter amount..."
                                {...register("amount", {
                                    required: "Amount is required!!!",
                                    pattern: {
                                        value: /^\d+(\.\d+)?$/,
                                        message: "Please enter a valid amount",
                                    },
                                })}
                                error={errors.amount?.message}
                                required={true}
                            />
                        </div>
                    </div>

                    {/* 3rd row: Cost Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                type="date"
                                label="Cost Date"
                                {...register("cost_date", {
                                    required: "Cost Date is required!!!"
                                })}
                                error={errors.cost_date?.message}
                                required={true}
                            />
                        </div>
                    {/* </div> */}

                    {/* Remarks */}
                    {/* <div className="grid grid-cols-1 gap-4"> */}
                        <TextArea
                            label="Remarks"
                            placeholder="Enter remarks (optional)"
                            rows={1}
                            {...register("remarks")}
                        />
                    </div>

                    <div className="flex">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={createPending || updatePending} className='ml-auto'>
                            {editId ? "Update Expense" : "Create Expense"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ExpenseForm;
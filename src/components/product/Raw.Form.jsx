import React, { useEffect, useState } from 'react'
import Input from '../inputs/Input'
import BooleanSwitch from '../inputs/BooleanSwitch'
import { Button } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import TextArea from '../inputs/TextArea'
import FileUpload from '../inputs/File'
import RHSelect from "../inputs/RHF/Select.RHF"
import fetchData from '../../Backend/fetchData.backend'
import AddModal from '../Add.modal'
import UnitTypeForm from '../unit/UnitType.Form'
import masterData from '../../Backend/master.backend'
import { RHFToFormData } from '../../utils/RHFtoFD'
import { errorAlert } from '../../utils/alerts'
import { useNavigate } from 'react-router-dom'

const RawForm = ({ setIsShow, editRawProduct }) => {
    const navigate = useNavigate();
    const [showUnitType, setShowUnitType] = useState(false);

    const { mutateAsync: createRaw, isPending: createRawPending } = masterData.TQCreateMaster(["productList"]);
    const { mutateAsync: updateRaw, isPending: updateRawPending } = masterData.TQUpdateMaster(["productList"]);

    const { data: unitTypeData, isLoading: unitTypeLoading } = fetchData.TQUnitTypeList({ noLimit: true });
    const { register, handleSubmit, formState: { errors }, control, reset, setValue, watch } = useForm({
        defaultValues: {
            name: editRawProduct?.name || "",
            reorder_level: editRawProduct?.reorder_level || "",
            p_code: editRawProduct?.sku || "",
            description: editRawProduct?.description || "",
            unit_type_id: editRawProduct?.unitRef?.id || "",
            image: ""
        }
    });


    /** generate RM code or SKU */
    const name = watch("name");
    const unit = watch("unit_type_id")?.name;

    useEffect(() => {
        if ([unit, name].some(item => item === "")) return;

        const parts = ["RM"];

        if (name) parts.push(name.toUpperCase());
        if (unit) parts.push(unit.toUpperCase());

        // Short time stamp (HHMMSS)
        const now = new Date();
        const timeStamp = now.toTimeString().slice(0, 8).replace(/:/g, "");

        parts.push(timeStamp);

        const code = parts.join("-");

        setValue("p_code", code);
    }, [name, unit, setValue]);


    async function submitData(data) {
        // console.log(data); return

        data.unit_type_id = data.unit_type_id?.id;
        try {
            if (editRawProduct === null) {
                const fd = RHFToFormData(data);
                const result = await createRaw({ path: "/product/create-raw", formData: fd });
                if (result?.success) {
                    reset();
                    setIsShow(false);
                }
            } else {
                if (!editRawProduct) {
                    errorAlert("Something Worng");
                    return;
                }

                data.id = editRawProduct?.id
                const fd = RHFToFormData(data);

                const result = await updateRaw({ path: "/product/update", formData: fd });
                if (result?.success) {
                    reset();
                    setIsShow(false);
                }
            }
            navigate("/master/products?tab=2");

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form onSubmit={handleSubmit(submitData)} className="space-y-5">
                    {/* 1st row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label={"Product Name"}
                                placeholder={"Enter name..."}
                                {...register("name", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.name?.message}
                                required={true}
                            />
                        </div>
                        <div>
                            <Input
                                label={"Product Code / SKU"}
                                placeholder={"code"}
                                {...register("p_code")}
                                disabled={true}
                            />
                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Controller
                                name="unit_type_id"
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

                                        label="Masure Unit"
                                        options={unitTypeData?.data}
                                        error={error?.message}
                                        required={true}

                                        addButton={true}
                                        buttonTitle='type'
                                        buttonOnClick={() => setShowUnitType(true)}

                                        objectReturn={true}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Input
                                label={"Minimum Stock Level"}
                                placeholder={"Enter minimum Stock level..."}
                                {...register("reorder_level")}
                            />
                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="image"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange } }) => (
                                <FileUpload
                                    label="Product Image"
                                    onChange={onChange} // gets File object
                                />
                            )}
                        />
                        <div className="">
                            <TextArea
                                label="Description"
                                rows={1}
                                {...register("description")}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center items-center">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit"
                            loading={createRawPending || updateRawPending}
                        >
                            {editRawProduct === null ? "Submit" : "Update"}
                        </Button>
                    </div>
                </form>
            </div>

            <AddModal
                isShow={showUnitType}
                setIsShow={setShowUnitType}
                title="Add New Unit Type"
                maxWidth={'50'}
            >
                <UnitTypeForm setIsShow={setShowUnitType} />
            </AddModal>

        </div>
    )
}

export default RawForm
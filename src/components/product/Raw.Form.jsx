import React, { useState } from 'react'
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

const RawForm = () => {
    const [showUnitType, setShowUnitType] = useState(false);

    const { data: unitTypeData, isLoading: unitTypeLoading } = fetchData.TQUnitTypeList({ noLimit: true });

    const { register, handleSubmit, formState: { errors }, control } = useForm();

    const editId = 3;

    return (
        <div className="panel" id="forms_grid">
            <div className="mb-5">
                <form onSubmit={handleSubmit()} className="space-y-5">
                    {/* 1st row */}
                    <div className="grid grid-cols-1 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Controller
                                name="masure"
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
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Input
                                label={"Minimum Stock Level"}
                                placeholder={"Enter minimum Stock level..."}
                                {...register("re_order")}
                            />
                        </div>
                    </div>

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
                            />
                        </div>
                    </div>


                    <div className="flex justify-center items-center">
                        <Button variant="filled" color="indigo" size="md" radius="md" type="submit" >
                            {editId ? "Update Package Type" : "Create Package Type"}
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
import React, { useState } from 'react';
import { FaWarehouse, FaMapMarkerAlt, FaGlobe, FaSave, FaTimes } from 'react-icons/fa';
import { MdOutlineCategory, MdOutlineLocationCity } from 'react-icons/md';
import Input from '../../components/inputs/Input';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import { useSelector } from 'react-redux';
import fetchData from '../../Backend/fetchData.backend';
import { Button } from '@mantine/core';
import business from '../../Backend/business.fetch';



const STORE_TYPE = [
    { label: "RM Store (Raw Materials)", value: "low" },
    { label: "FG Store (Finished Goods)", value: "normal" },
    { label: "Production", value: "high" },
]

const CreateStoreForm = ({ setIsShow }) => {
    const stateData = useSelector(state => state.location);

    const { register, handleSubmit, formState: { errors }, reset, control, watch, setValue } = useForm();

    const state = watch("state");
    const { data: districtData, isLoading: districtIsLoading } = fetchData.TQDistrictList(state?.id);
    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = business.TQManufacturingNodeList();


    async function submit(data) {
        data.state = data.state?.name;
        data.district = data.district?.name;
        data.business_node_id = data.business_node_id?.id;

        console.log(data);
    }

    return (
        <div className="panel font-sans">

            <form className="space-y-6" onSubmit={handleSubmit(submit)}>

                {/* 1. Basic Identification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            // Icon={FaWarehouse}
                            placeholder="e.g. Central Raw Material Hub"
                            label="Store Name"
                            {...register("store_name", { required: true })}
                            error={errors.store_name?.message}
                        />
                    </div>

                    <div>
                        <Controller
                            name="node_type"
                            rules={
                                { require: "This field is required!!!" }
                            }
                            control={control}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <SearchableSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}
                                    isSearchable={false}

                                    label="Store Type"
                                    options={STORE_TYPE}

                                    error={error?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="business_node_id"
                            control={control}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={(e) => {
                                        if (e === null) setValue("node_type", null);
                                        return onChange(e);
                                    }}

                                    label="Manufacturing Location"
                                    options={registeredNodeList?.data}
                                    error={error?.message}
                                    objectReturn={true}
                                    isClearable={true}
                                />
                            )}
                        />
                    </div>
                </div>


                {/* 2. Location & Address */}
                <div className="space-y-4 pt-2 border-t border-gray-50">
                    <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2">
                        <FaMapMarkerAlt /> Geographic Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="">
                            <Input
                                // Icon={FaWarehouse}
                                placeholder="enter address"
                                label="Address"
                                {...register("address", {
                                    required: {
                                        value: true,
                                        message: "This field is required!!!"
                                    }
                                })}
                                required={true}
                                error={errors.address?.message}
                            />
                        </div>

                        <div className="">
                            <Input
                                // Icon={FaWarehouse}
                                placeholder="e.g. kolkata"
                                label="Location"
                                {...register("location", {
                                    required: {
                                        value: true,
                                        message: "This field is required!!!"
                                    }
                                })}
                                required={true}
                                error={errors.location?.message}
                            />
                        </div>

                        {/* State */}
                        <div>
                            <Controller
                                name="state"
                                control={control}
                                render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                                    <RHSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}

                                        label="Select State"
                                        options={stateData || []}
                                        objectReturn={true}
                                    />
                                )}
                            />
                        </div>

                        {/* district */}
                        <div>
                            <Controller
                                name="district"
                                control={control}
                                render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                                    <RHSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}

                                        label="Select district"
                                        options={districtData || []}
                                        disabled={state ? false : true}
                                        objectReturn={true}
                                    />
                                )}
                            />
                        </div>

                        {/* Latitude & Longitude */}
                        <div className="flex gap-4 md:col-span-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="0.00"
                                    label="Lat"
                                    {...register("lat")}
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    placeholder="0.00"
                                    label="Long"
                                    {...register("Long")}
                                />
                            </div>
                        </div>
                    </div>
                </div>




                {/* Form Footer */}
                <div className="pt-6 flex justify-end items-center gap-3">
                    <button
                        type="button"
                        // onClick={onClose}
                        className=" px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        className="px-6 py-5 bg-[#0052CC] text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all"
                    >
                        <FaSave /> Save Store Location
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateStoreForm;
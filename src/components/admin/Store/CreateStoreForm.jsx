import React, { useState, useEffect } from 'react';
import { FaWarehouse, FaMapMarkerAlt, FaGlobe, FaSave, FaTimes } from 'react-icons/fa';
import { MdOutlineCategory, MdOutlineLocationCity } from 'react-icons/md';
import Input from '../../inputs/Input';
import SearchableSelect from '../../inputs/SearchableSelect';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from '../../inputs/RHF/Select.RHF';
import { useSelector } from 'react-redux';
import fetchData from '../../../Backend/fetchData.backend';
import { Button } from '@mantine/core';
import business from '../../../Backend/business.fetch';
import masterData from '../../../Backend/master.backend';
import { useNavigate } from 'react-router-dom';



const STORE_TYPE = [
    { label: "RM Store (Raw Materials)", value: "rm_store" },
    { label: "FG Store (Finished Goods)", value: "fg_store" },
    { label: "Production", value: "production" },
]

const CreateStoreForm = ({
    selectedStore,
    setSelectedStore,
    isTypeDisabled = false,
    editData = null
}) => {
    const navigate = useNavigate();
    const stateData = useSelector(state => state.location);

    /**************** APT mutation *******************/
    const { mutateAsync: createData, isLoading: createLoading } = masterData.TQCreateMaster(["storeCount", "storeList"]);
    const { mutateAsync: updateData, isLoading: updateLoading } = masterData.TQUpdateMaster(["storeCount", "storeList"]);


    /**************** react form hook *******************/
    const { register, handleSubmit, formState: { errors }, reset, control, watch, setValue } = useForm({
        defaultValues: {
            name: editData?.name || "",
            store_type: editData?.store_type || "",

            business_node_id: editData?.parentBusinessNode || "",

            address: editData?.address?.address || "",
            location: editData?.location || "",
            state: editData?.address?.state || "",
            district: editData?.address?.district || "",
            pincode: editData?.address?.pincode || "",
            lat: editData?.address?.lat || "",
            long: editData?.address?.long || "",
        }
    });

    useEffect(() => {
        if (typeof selectedStore === "boolean") return;

        setValue("store_type", selectedStore === "RAW" ? "rm_store" : selectedStore === "FIN" ? "fg_store" : selectedStore === "MFG" ? "production" : "");
    }, [selectedStore, setValue]);

    /**************** data fetching GET *******************/
    const state = watch("state");
    const { data: districtData, isLoading: districtIsLoading } = fetchData.TQDistrictList(state?.id);
    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = business.TQManufacturingNodeList();



    /**************** handler methods *******************/
    const onClose = () => {
        setSelectedStore(null);
        reset();
    }

    function addMfgLocation() {
        const mfg = {
            id: 1,
            name: "Mfg Bond Warehouse",
            code: "L-101",
            category: "manufacturing"
        };
        navigate("/admin/location/register", {
            state: { ...mfg }
        });
    }

    async function submit(data) {
        // console.log(data); return
        try {

            if (editData) {
                data.id = editData?.id;
                data.business_node_id = data.business_node_id?.id;

                const res = await updateData({ path: "/store/update", formData: data });
                if (res?.success) {
                    setSelectedStore(false);
                    reset();
                }

            } else {
                // data.state = data.state?.name;
                // data.district = data.district?.name;
                data.business_node_id = data.business_node_id?.id;

                const res = await createData({ path: "/store/create", formData: data });
                if (res?.success) {
                    setSelectedStore(null);
                    reset();
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="panel font-sans">

            <form className="space-y-6" onSubmit={handleSubmit(submit)}>

                {/* 1. Basic Identification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Controller
                            name="store_type"
                            rules={{
                                required: "This field is required!!!"
                            }}
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

                                    required={true}
                                    error={error?.message}

                                    disabled={isTypeDisabled}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="business_node_id"
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
                                    objectReturn={true}
                                    isClearable={true}

                                    label="Manufacturing Location"
                                    options={registeredNodeList?.data}

                                    required={true}
                                    error={error?.message}

                                    addButton={true}
                                    buttonTitle="Add"
                                    buttonOnClick={addMfgLocation}
                                />
                            )}
                        />
                    </div>

                    {/* 1. Store name */}
                    <div className="md:col-span-2">
                        <Input
                            // Icon={FaWarehouse}
                            placeholder="e.g. Central Raw Material Hub"
                            label="Store Name"
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "This field is required!!!"
                                }
                            })}
                            required={true}
                            error={errors.name?.message}
                        />
                    </div>
                </div>


                {/* 2. Location & Address */}
                <div className="space-y-4 pt-2 border-t border-gray-50">
                    <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2">
                        <FaMapMarkerAlt /> Geographic Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* address */}
                        <div className="">
                            <Input
                                // Icon={FaWarehouse}
                                placeholder="Enter full address"
                                label="Full Address"
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

                        {/* location */}
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                    </div>

                    {/* Latitude & Longitude */}
                    <div className="flex gap-4 md:col-span-3">
                        <div className="flex-1">
                            <Input
                                placeholder="Enter pincode"
                                label="Pincode"
                                {...register("pincode")}
                            />
                        </div>
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
                                {...register("long")}
                            />
                        </div>
                    </div>
                </div>


                {/* Form Footer */}
                <div className="pt-6 flex justify-end items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className=" px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        className="px-6 py-5 bg-[#0052CC] text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all"
                        loading={createLoading || updateLoading}
                    >
                        <FaSave /> Save Store Location
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default CreateStoreForm;
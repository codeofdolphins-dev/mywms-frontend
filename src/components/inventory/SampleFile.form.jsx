import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../inputs/RHF/Select.RHF";
import RHRadioGroup from '../inputs/RHF/RHRadioGroup';
import business from '../../Backend/business.fetch';
import fetchData from '../../Backend/fetchData.backend';
import SearchableSelect from '../inputs/SearchableSelect';
import { Button } from '@mantine/core';
import excel from '../../Backend/downloads/excel/excel.download';
import AddModal from '../Add.modal';
import CreateStoreForm from '../admin/Store/CreateStoreForm';
import { useNavigate } from 'react-router-dom';

const SampleFileForm = ({ onCancel }) => {
    const navigate = useNavigate();

    const { mutateAsync: downloadSample, isPending: downloadSamplePending } = excel.TQSampleOpeningStockExcelDownload();


    const [isHasStore, setIsHasStore] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [store, setStore] = useState(false);
    

    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = business.TQManufacturingNodeList();

    const { control, formState: { errors }, watch, handleSubmit, resetField } = useForm();

    const locationId = watch("locationId");
    const storeType = watch("storeType");
    const storeId = watch("storeId");

    const params = {
        location_id: locationId?.id,
        noLimit: true
    };
    const { data: storeData, isLoading: storeLoading } = fetchData.TQStoreList(params, Boolean(locationId?.id));


    /** check is the location has any store */
    useEffect(() => {
        if (!storeData) return;

        if (storeData?.data?.length > 0) {
            setIsHasStore(true);
        } else {
            setIsHasStore(false);
        }
    }, [storeLoading, storeData]);


    /** filter store list based on store type */
    useEffect(() => {
        if (!storeData) return;

        setStoreList(storeData?.data?.filter((item) => item.store_type === storeType))
    }, [storeType, storeData]);

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


    function onSubmit(data) {
        const formData = {
            locationId: data.locationId?.id,
            storeId: data.storeId,
            type: data.storeType === "fg_store" ? "finished" : "raw"
        };
        downloadSample(formData).then(() => onCancel());
    }

    return (
        <>
            <form className="panel" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4">

                    {/* location */}
                    <div>
                        <Controller
                            name="locationId"
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
                                    onChange={(e) => {
                                        resetField("storeType");
                                        resetField("storeId");
                                        onChange(e)
                                    }}

                                    label="Select Location"
                                    labelPosition="inline"
                                    options={registeredNodeList?.data}
                                    error={error?.message}
                                    objectReturn={true}
                                    required={true}

                                    addButton={true}
                                    buttonTitle="Location"
                                    buttonOnClick={addMfgLocation}
                                />
                            )}
                        />
                    </div>

                    {/* store type */}
                    <div className="">
                        <Controller
                            name="storeType"
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

                                    disabled={!Boolean(locationId) || !isHasStore}

                                    label="Store Type"
                                    labelPosition='inline'
                                    options={[
                                        { label: "FG Store", value: "fg_store" },
                                        { label: "RM Store", value: "rm_store" },
                                    ]}
                                />
                            )}
                        />
                    </div>

                    {/* store */}
                    <div className="">
                        <Controller
                            name="storeId"
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

                                    disabled={
                                        !Boolean(locationId) ||
                                        !isHasStore ||
                                        !Boolean(storeType) ||
                                        storeList.length === 0
                                    }

                                    label="Select Store"
                                    labelPosition="inline"
                                    options={storeList}
                                    error={error?.message}

                                    addButton={true}
                                    buttonTitle="Store"
                                    buttonOnClick={() => setStore(true)}
                                />
                            )}
                        />
                    </div>

                    {/* buttons */}
                    <div className="mt-10 flex justify-end items-center">
                        <Button
                            type="submit"
                            variant="primary"
                            loading={downloadSamplePending}
                            disabled={!Boolean(storeId)}
                        >
                            Download Sample File
                        </Button>
                    </div>
                </div>

            </form>

            <AddModal
                isShow={store}
                setIsShow={setStore}
                title={"Add New Store"}
                maxWidth='75'
            >
                <CreateStoreForm
                    setSelectedStore={setStore}
                />
            </AddModal>
        </>
    )
}

export default SampleFileForm
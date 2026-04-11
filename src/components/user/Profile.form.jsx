import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import Input from '../inputs/Input';
import TextArea from '../inputs/TextArea';
import FileUpload from '../inputs/File';
import { useSelector } from 'react-redux';
import RHSelect from "../inputs/RHF/Select.RHF";
import fetchData from '../../Backend/fetchData.backend';
import masterData from '../../Backend/master.backend';

const ProfileForm = ({ isLoading = false, setIsProfileShow }) => {
    const stateData = useSelector(state => state.location);
    const user = useSelector(state => state.auth.userData);
    const nodeDetails = user?.activeNode?.nodeDetails;
    const is_owner = user?.is_owner;

    const defaultValues = {};


    const { mutateAsync: updateDetails, isPending: updatePending } = masterData.TQUpdateMaster(["currentUser"]);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, control } = useForm({
        defaultValues: {
            name: user?.company_name,
            location: nodeDetails?.location || "",
            // address JSONB fields
            address: nodeDetails?.address?.address || "",
            state: nodeDetails?.address?.state || "",
            district: nodeDetails?.address?.district || "",
            lat: nodeDetails?.address?.lat || "",
            long: nodeDetails?.address?.long || "",
            // other fields
            image: null,
            gst_no: nodeDetails?.gst_no || "",
            license_no: nodeDetails?.license_no || "",
            desc: nodeDetails?.desc || ""
        }
    });

    const state = watch("state");

    const { data: districtData, isLoading: districtIsLoading } = fetchData.TQDistrictList(state?.id);

    const submit = async (data) => {
        try {
            const payload = {
                user_id: user?.id,
                businessNode_id: user?.activeNode?.id,
                name: data.name,
                location: data.location,
                address: data.address,
                state: data.state,
                district: data.district,
                lat: data.lat,
                long: data.long,
                image: data.image,
                gst_no: data.gst_no,
                license_no: data.license_no,
                desc: data.desc
            };

            console.log(payload);

            const res = await updateDetails({ path: "/admin/update-details", formData: payload })
            if (res.success) {
                reset();
                setIsProfileShow(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="panel" id="profile_form">
            <div className="mb-5">
                <h5 className="text-lg font-semibold mb-4">Profile Details</h5>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">

                    {/* Row 1 — Business Node ID & Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Name"
                                placeholder="Enter name..."
                                {...register("name", {
                                    required: "Name is required",
                                })}
                                error={errors.name?.message}
                                required
                                labelPosition="inline"
                            />
                        </div>
                        <div>
                            <Input
                                label="Location"
                                placeholder="Enter location..."
                                {...register("location", {
                                    required: "Location is required",
                                })}
                                error={errors.location?.message}
                                required
                                labelPosition="inline"
                            />
                        </div>
                    </div>

                    {/* Row 2 Address Section */}
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h6 className="text-sm font-medium text-gray-700">Address Details</h6>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 w-1/6">Address <span className='text-danger'>*</span> </label>
                                    <Input
                                        id="address"
                                        placeholder="Enter full address..."
                                        {...register("address", { required: "Address is required!!!" })}
                                        required={true}
                                        error={errors.address?.message}
                                    />
                                </div>
                            </div>
                            <div>
                                {/* State */}
                                <Controller
                                    name="state"
                                    control={control}
                                    rules={{
                                        required: "This field is required!!!"
                                    }}
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
                                            labelPosition='inline'
                                            options={stateData}
                                            required={true}
                                            error={error?.message}
                                            objectReturn={true}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                {/* district */}
                                <Controller
                                    name="district"
                                    control={control}
                                    rules={{
                                        required: "This field is required!!!"
                                    }}
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
                                            labelPosition='inline'
                                            options={districtData}
                                            required={true}
                                            error={error?.message}
                                            disabled={state ? false : true}
                                            objectReturn={true}
                                        />
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label="Latitude"
                                        type="text"
                                        placeholder="e.g. 28.6139"
                                        {...register("lat")}
                                        labelPosition="inline"
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Longitude"
                                        type="text"
                                        placeholder="e.g. 77.2090"
                                        {...register("long")}
                                        labelPosition="inline"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 3 — GST & License */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="GST No."
                                placeholder="Enter GST number..."
                                {...register("gst_no", { required: "GST No. is required!!!" })}
                                labelPosition="inline"
                                required={true}
                                error={errors.gst_no?.message}
                            />
                        </div>
                        <div>
                            <Input
                                label="License No."
                                placeholder="Enter license number..."
                                {...register("license_no")}
                                labelPosition="inline"
                            />
                        </div>
                    </div>

                    {/* Row 4 — Image Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <FileUpload
                                label="Profile Image"
                                helperText="Accepted formats: JPG, PNG (Max 5MB)"
                                onChange={(file) => setValue("image", file)}
                                labelPosition="inline"
                            />
                        </div>
                        <div>
                            <TextArea
                                label="Description"
                                placeholder="Enter a description..."
                                rows={1}
                                {...register("desc")}
                                labelPosition="inline"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end items-center !mt-8">
                        <Button
                            variant="filled"
                            color="indigo"
                            size="md"
                            radius="md"
                            type="submit"
                            loading={isLoading}
                        >
                            Save Profile
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
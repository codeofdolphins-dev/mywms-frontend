import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useAsyncError, useNavigate, useParams } from 'react-router-dom';
import RHSelect from "@/components/inputs/RHF/Select.RHF";
import Input from '@/components/inputs/Input';
import TextArea from '@/components/inputs/TextArea';
import SearchableSelect from '@/components/inputs/SearchableSelect';
import fetchData from '@/Backend/fetchData.backend';
import { useSelector } from 'react-redux';
import masterData from '@/Backend/master.backend';
import { RHFToFormData } from '@/utils/RHFtoFD';
import { Button } from '@mantine/core';
import ProfileCard from '@/components/user/userProfile/ProfileCard';
import FileUpload from '../../components/inputs/File';

const USER_TYPE = [
    { label: "Location Admin", value: "NODE_ADMIN" },
    { label: "Location User", value: "NODE_USER" },
]

const CreateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["allUserList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["allUserList"]);


    const [preview, setPreview] = useState(null);
    const [oldPreview, setOldPreview] = useState(null);
    const [fileKey, setFileKey] = useState(0);


    const { handleSubmit, register, control, setValue, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            node: null,
            node_type: null,
            image: null,
        }
    });


    const password = watch("password");
    const node = watch("node") || null;
    const node_type = watch("node_type") || null;
    const full_name = watch("full_name") || null;
    const phone_no = watch("phone_no") || null;
    const image = watch("image") || null;
    const email = watch("email") || null;


    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = fetchData.TQTenantRegisteredNodeList();
    const { data: editUserDetails, isLoading: editUserDetailsLoading } = fetchData.TQAllUserList({ id }, !!id);


    /** generate object url for image preview */
    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        };

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);


    /** prefill fields for edit details */
    useEffect(() => {
        const data = editUserDetails?.data
        reset({
            full_name: data?.name?.full_name,
            phone_no: data?.phone_no,
            email: data?.email,
        });
        setOldPreview(data?.profile_image);
    }, [editUserDetailsLoading])


    async function submitForm(data) {
        if (id) data.id = id;
        const formData = RHFToFormData(data);

        try {
            if (id) {
                const res = await updateData({ path: `/auth/update-user`, formData });
                if (res.success) {
                    reset();
                    setPreview(null);
                    setFileKey(prev => prev + 1);
                    navigate(-1);
                }

            } else {
                const res = await createData({ path: `/auth/register-user`, formData });
                if (res.success) {
                    reset({
                        full_name: "",
                        phone_no: "",
                        email: "",
                        password: "",
                        node: null,
                        node_type: null,
                        image: null,
                    });

                    setPreview(null);
                    setOldPreview(null);
                    setFileKey(prev => prev + 1);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>

            {/* breadcrumb */}
            <ul className="flex space-x-2">
                <li>
                    <Link to="/user" className="text-primary hover:underline">
                        user
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span> {id ? "update user" : "register & assign user"}</span>
                </li>
            </ul>

            <form onSubmit={handleSubmit(submitForm)} className='mt-5'>
                <div className="grid grid-cols-1 min-[820px]:grid-cols-2 gap-8">
                    <div className="panel space-y-6">

                        {/* select location node */}
                        {id
                            ?
                            <></>
                            :
                            <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
                                {/* assign location */}
                                <div className="">
                                    <Controller
                                        name="node"
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

                                                label="Assign Place"
                                                labelPosition={"inline"}
                                                options={registeredNodeList?.data}
                                                error={error?.message}
                                                objectReturn={true}
                                                isClearable={true}
                                            />
                                        )}
                                    />
                                </div>

                                {/* node type */}
                                <div className="">
                                    <Controller
                                        name="node_type"
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

                                                label="User Type"
                                                labelPosition={"inline"}
                                                options={USER_TYPE}
                                                disabled={node === null ? true : false}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        }

                        {/* 1st row */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            {/* Full Name */}
                            <div>
                                <Input
                                    label={"Full Name"}
                                    labelPosition={"inline"}
                                    placeholder={"Enter Full Name..."}
                                    {...register("full_name", {
                                        required: {
                                            value: id ? false : true,
                                            message: "This field is required!!!",
                                        }
                                    })}
                                    error={errors.full_name?.message}
                                    required={id ? false : true}
                                />
                            </div>
                            {/* Phone Number */}
                            <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
                                <div>
                                    <Input
                                        label={"Phone Number"}
                                        labelPosition={"inline"}
                                        type="number"
                                        placeholder={"Enter Phone Number..."}
                                        {...register("phone_no", {
                                            required: {
                                                value: id ? false : true,
                                                message: "This field is required!!!",
                                            }
                                        })}
                                        error={errors.phone_no?.message}
                                        required={id ? false : true}
                                    />
                                </div>
                                {/* file upload */}
                                <div >
                                    <Controller
                                        key={fileKey}
                                        name="image"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field: { onChange } }) => (
                                            <FileUpload
                                                label="Profile Image"
                                                labelPosition={"inline"}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2rd row */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <div>
                                <Input
                                    label={"Email"}
                                    labelPosition={"inline"}
                                    placeholder={"Enter Email..."}
                                    {...register("email", {
                                        required: {
                                            value: id ? false : true,
                                            message: "This field is required!!!",
                                        }
                                    })}
                                    error={errors.email?.message}
                                    required={true}
                                    disabled={id ? true : false}
                                />
                            </div>

                            <div>
                                <Input
                                    label={"Password"}
                                    labelPosition={"inline"}
                                    type="password"
                                    placeholder={"Enter Password..."}
                                    {...register("password", {
                                        required: {
                                            value: id ? false : true,
                                            message: "This field is required!!!",
                                        }
                                    })}
                                    error={errors.password?.message}
                                    required={id ? false : true}
                                />
                            </div>
                        </div>

                        {/* button */}
                        <div className="flex items-center justify-end gap-11">
                            <button
                                type='button'
                                className='btn btn-outline-dark'
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>

                            <Button
                                type='submit'
                                className='btn btn-info'
                                loading={createPending || updatePending}
                            >
                                {id ? "Update" : "Submit"}
                            </Button>
                        </div>
                    </div>

                    <ProfileCard
                        data={{
                            location: node?.name,
                            role: node_type,
                            full_name,
                            phone_no, image, email
                        }}
                        image={preview}
                        onCreate={true}
                        onEdit={id ? false : true}
                        oldPreview={oldPreview}
                    />
                </div>
            </form>


        </div>
    )
}

export default CreateUser
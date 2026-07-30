import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RHSelect from "@/components/inputs/RHF/Select.RHF";
import Input from '@/components/inputs/Input';
import fetchData from '@/Backend/fetchData.backend';
import masterData from '@/Backend/master.backend';
import { RHFToFormData } from '@/utils/RHFtoFD';
import { Button } from '@mantine/core';
import FileUpload from '../../components/inputs/File';
import ProfileCard from '../../components/user/userProfile/ProfileCard';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import RHRadioGroup from '../../components/inputs/RHF/RHRadioGroup';
import ComponentHeader from '../../components/ComponentHeader';
import { deptType_createUser } from './helper';



const CreateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // place passed by the User page card's "+" button
    const stateNode = (location?.state && typeof location.state === "object") ? location.state : null;

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["allUserList", "userCountByNode"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["allUserList", "userCountByNode"]);


    const [preview, setPreview] = useState(null);
    const [oldPreview, setOldPreview] = useState(null);
    const [fileKey, setFileKey] = useState(0);


    const { handleSubmit, register, control, reset, watch, formState: { errors } } = useForm({
        shouldUnregister: true,
        defaultValues: {
            full_name: "",
            phone_no: "",
            email: "",
            password: "",
            image: null,
            store_id: null,
        }
    });


    /** on register the place comes from the User page cards, on update it is not editable */
    const node = id ? null : stateNode;
    const password = watch("password");
    const isNodeAdmin = watch("isNodeAdmin") || null;
    const storeType = watch("storeType") || null;
    const dept = watch("dept") || null;
    const full_name = watch("full_name") || null;
    const phone_no = watch("phone_no") || null;
    const image = watch("image") || null;
    const email = watch("email") || null;

    // console.log(node)

    const params = {
        location_id: node?.id,
        noLimit: true,
        store_type: storeType
    };
    const { data: storeData, isLoading: storeLoading } = fetchData.TQStoreList(params, Boolean(node?.id && storeType));



    const { data: editUserDetails, isLoading: editUserDetailsLoading } = fetchData.TQAllUserList({ id }, !!id);


    /** register mode needs a place from the User page cards */
    useEffect(() => {
        if (!id && !stateNode) navigate("/admin/user", { replace: true });
    }, []);


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
    }, [editUserDetailsLoading]);

    async function submitForm(data) {
        data.node_id = node?.businessNode?.id;
        data.node = node;
        if (id) data.id = id;
        
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== null)
        );
        
        const formData = RHFToFormData(filteredData);

        try {
            if (id) {
                const res = await updateData({ path: `/auth/update-user`, formData });
                if (res.success) {
                    reset();
                    setPreview(null);
                    setFileKey(prev => prev + 1);
                    navigate("/admin/user");
                }

            } else {
                const res = await createData({ path: `/auth/register-user`, formData });
                if (res.success) {
                    reset();

                    setPreview(null);
                    setOldPreview(null);
                    setFileKey(prev => prev + 1);
                    navigate("/admin/user");
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>

            {/* breadcrumb */}
            <ComponentHeader
                showSearch={false}
                headerLink={[
                    { title: "user", link: "/admin/user" },
                    { title: id ? "update user" : "register & assign user" },
                ]}
            />

            <form onSubmit={handleSubmit(submitForm)} className='mt-5'>
                <div className="grid grid-cols-1 min-[820px]:grid-cols-2 gap-8">
                    <div className="panel space-y-6">

                        {/* assigned place (chosen from the User page cards) */}
                        {id
                            ?
                            <></>
                            :
                            <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
                                <div className="flex justify-between items-center">
                                    <h1 className="text-xl font-bold my-3">
                                        Assign to: {node?.name}
                                    </h1>
                                    <span className='badge bg-info uppercase'>
                                        {node?.businessNode?.type?.name || "Company"}
                                    </span>
                                </div>

                                {node !== null && (
                                    node?.businessNode?.node_type_code === null ?
                                        <>
                                            {/* dept */}
                                            <div className="">
                                                <Controller
                                                    name="dept"
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

                                                            label="Department"
                                                            labelPosition={"inline"}
                                                            options={deptType_createUser}
                                                            disabled={node === null ? true : false}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </> : <>
                                            {node?.businessNode?.type?.category === "manufacturing" ?
                                                <>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {/* select store type */}
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

                                                                        label="Store Type"
                                                                        labelPosition='inline'
                                                                        options={[
                                                                            { label: "RM Store", value: "rm_store" },
                                                                            { label: "Production", value: "production" },
                                                                            { label: "FG Store", value: "fg_store" },
                                                                        ]}
                                                                    />
                                                                )}
                                                            />
                                                        </div>

                                                        {/* select store */}
                                                        <div className="">
                                                            <Controller
                                                                name="store_id"
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

                                                                        label="Select Store"
                                                                        labelPosition="inline"
                                                                        options={storeData?.data}
                                                                        error={error?.message}

                                                                    // addButton={true}
                                                                    // buttonTitle="Store"
                                                                    // buttonOnClick={() => setStore(true)}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </> : <>
                                                    {/* isNodeAdmin */}
                                                    <div className=''>
                                                        <Controller
                                                            name="isNodeAdmin"
                                                            control={control}
                                                            defaultValue={false}
                                                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                                <RHRadioGroup
                                                                    ref={(el) => {
                                                                        ref({
                                                                            focus: () => el?.focus(),
                                                                        });
                                                                    }}
                                                                    value={value ?? false}
                                                                    onChange={onChange}
                                                                    label="Location Admin"
                                                                    labelPosition={"inline"}
                                                                    options={[
                                                                        { label: "Yes", value: true },
                                                                        { label: "No", value: false },
                                                                    ]}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </>
                                            }
                                        </>
                                )}
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
                                onClick={() => navigate("/admin/user")}
                            >
                                Cancel
                            </button>

                            {/* <Button
                                type='button'
                                className='btn btn-info'
                                onClick={() => {
                                    reset();
                                    // setFileKey(prev => prev + 1);
                                }}
                            >
                                Reset
                            </Button> */}
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
                            isNodeAdmin: isNodeAdmin,
                            dept: dept,
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
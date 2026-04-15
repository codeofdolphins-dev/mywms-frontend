import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../../components/inputs/RHF/Select.RHF";
import RegisterWarehouseNode from '../../../components/admin/register/RegisterWarehouseNode';
import RegisterPartnerNode from '../../../components/admin/register/RegisterPartnerNode';
import masterData from '../../../Backend/master.backend';
import { RHFToFormData } from '../../../utils/RHFtoFD';
import path from 'path';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import business from '../../../Backend/business.fetch';
import ComponentHeader from '../../../components/ComponentHeader';
import { headLink_register_location } from './helper';



const RegisterLocation = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const mfg = location?.state;

    const { id } = useParams();

    const [editData, setEditData] = useState(null);


    const { mutateAsync: registerWarehouse, isPending: isPendingWarehouse } = masterData.TQCreateMaster(["tenantRegisteredNodeList"]);
    const { mutateAsync: updateLocation, isPending: locationIsPending } = masterData.TQUpdateMaster(["tenantRegisteredNodeList"]);


    const { data: businessNodes, isLoading: businessNodeLoading } = business.TQTenantBusinessNodeList();
    const { data: locationData, isLoading: locationIsLoading } = business.TQTenantRegisteredNodeList({ id }, Boolean(id));


    const { register, control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        defaultValues: {
            node: null
        }
    });

    const node = watch("node");


    /** setup prefill fields */
    useEffect(() => {
        if (!mfg) return;

        if (typeof mfg === "object") setValue("node", mfg);
    }, [businessNodeLoading, mfg]);


    useEffect(() => {
        if (!id) return;
        const data = locationData?.data
        const type = data?.businessNode?.type

        setValue("node", type);
        setValue("full_name", data?.name);
        setValue("location", data?.location);
        setValue("gst_no", data?.gst_no);
        setValue("license_no", data?.license_no);
        setValue("address", data?.address?.address);
        setValue("lat", data?.address?.lat);
        setValue("long", data?.address?.long);
        setValue("pincode", data?.address?.pincode);
        setValue("desc", data?.desc);

        setValue("state", data?.address?.state);
        setValue("district", data?.address?.district);
        setEditData(data);

    }, [id, locationData, locationIsLoading]);



    const submitForm = async (data) => {
        const formData = RHFToFormData(data);

        try {
            const res = await registerWarehouse({ path: "/admin/register-node", formData });

            if (res.success) {
                if (mfg) navigate(-1);

                reset({ node: null });
                navigate("/admin/location")
            }
        } catch (error) {
            console.log(error)
        }
    }


    console.log(node);

    return (
        <div>
            <ComponentHeader
                showSearch={false}
                headerLink={headLink_register_location}
            />

            <form onSubmit={handleSubmit(submitForm)} className='mt-3 space-y-3'>
                <div className="panel">
                    <Controller
                        name="node"
                        control={control}
                        isClearable={false}
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
                                onChange={(val) =>
                                    reset({ node: val })
                                }

                                label="Select Model Type"
                                options={businessNodes?.data}
                                error={error?.message}
                                required={true}
                                objectReturn={true}
                            />
                        )}
                    />
                </div>

                {node
                    ? ["manufacturing", "warehouse"].includes(node?.category)
                        ?
                        <RegisterWarehouseNode
                            key={node?.id}
                            register={register}
                            control={control}
                            watch={watch}
                            errors={errors}
                            header={node}
                        />
                        : <RegisterPartnerNode
                            key={node?.id}
                            register={register}
                            control={control}
                            watch={watch}
                            errors={errors}
                            header={node}
                        />
                    : null
                }

            </form>
        </div>
    )
}

export default RegisterLocation
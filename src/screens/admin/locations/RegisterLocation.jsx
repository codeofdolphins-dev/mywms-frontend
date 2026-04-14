import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../../components/inputs/RHF/Select.RHF";
import RegisterWarehouseNode from '../../../components/admin/register/RegisterWarehouseNode';
import RegisterPartnerNode from '../../../components/admin/register/RegisterPartnerNode';
import masterData from '../../../Backend/master.backend';
import { RHFToFormData } from '../../../utils/RHFtoFD';
import path from 'path';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import business from '../../../Backend/business.fetch';

const RegisterLocation = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const mfg = location?.state;

    const { data: businessNodes, isLoading: businessNodeLoading } = business.TQTenantBusinessNodeList();
    const { mutateAsync: registerWarehouse, isLoading: isPendingWarehouse } = masterData.TQCreateMaster(["tenantRegisteredNodeList"]);

    const { register, control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        defaultValues: {
            node: null
        }
    });

    const node = watch("node");

    useEffect(() => {
        if (typeof mfg === "object") setValue("node", mfg);
    }, [businessNodeLoading, mfg])

    const submitForm = async (data) => {
        const formData = RHFToFormData(data);

        try {
            const res = await registerWarehouse({ path: "/super-admin/register-node", formData });

            if (res.success) {
                if (mfg) navigate(-1);

                reset({ node: null });
                navigate("/admin/location")
            }
        } catch (error) {
            console.log(error)
        }
    }


    // console.log(node);

    return (
        <div>
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
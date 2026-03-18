import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import RegisterWarehouseNode from '../../components/admin/register/RegisterWarehouseNode';
import RegisterPartnerNode from '../../components/admin/register/RegisterPartnerNode';
import masterData from '../../Backend/master.backend';
import { RHFToFormData } from '../../utils/RHFtoFD';
import path from 'path';
import { Link } from 'react-router-dom';
import business from '../../Backend/business.fetch';

const RegisterNode = () => {

    const { data: businessNodes, isLoading: businessNodeLoading } = business.TQTenantBusinessNodeList();
    const { mutateAsync: registerWarehouse, isLoading: isPendingWarehouse } = masterData.TQCreateMaster(["tenantRegisteredNodeList"]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        defaultValues: {
            node: null
        }
    });

    const node = watch("node");

    const submitForm = async (data) => {
        const formData = RHFToFormData(data);

        try {
            const res = await registerWarehouse({ path: "/super-admin/register-node", formData })
            console.log(res)
            if (res.success) reset({ node: null });
        } catch (error) {
            console.log(error)
        }
    }

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

export default RegisterNode
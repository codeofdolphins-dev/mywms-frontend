import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import fetchData from '../../Backend/fetchData';
import RegisterWarehouseNode from '../../components/admin/register/RegisterWarehouseNode';
import RegisterPartnerNode from '../../components/admin/register/RegisterPartnerNode';
import masterData from '../../Backend/master.backend';
import { RHFToFormData } from '../../utils/RHFtoFD';
import path from 'path';
import { Link } from 'react-router-dom';

const RegisterNode = () => {

    const { data: businessNodes, isLoading: businessNodeLoading } = fetchData.TQTenantBusinessNodeList();
    const { mutateAsync: registerWarehouse, isLoading: isPendingWarehouse } = masterData.TQCreateMaster();
    const { mutateAsync: registerPartner, isPending: isPendingPartner } = masterData.TQCreateMaster();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        shouldUnregister: true
    });

    const node = watch("node");

    const submitForm = async (data) => {
        console.log(data);

        const formData = RHFToFormData(data);

        try {
            if (["manufacturing", "warehouse"].includes(node?.category)) {
                console.log("wareouse");

                const res = await registerWarehouse({ path: "/super-admin/register-node-warehouse", formData })
                if (res.success) reset();

            } else {
                console.log("partner");
                const res = await registerPartner({ path: "/super-admin/register-node-partner", formData });
                if (res.success) reset();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 space-x-reverse">
                <li className="before:content-['/'] before:mr-1">
                    <span>register</span>
                </li>
            </ul>

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
                                selectKey='name'
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
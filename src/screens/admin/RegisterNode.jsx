import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import fetchData from '../../Backend/fetchData';
import RegisterWarehouseNode from '../../components/admin/register/RegisterWarehouseNode';
import RegisterPartnerNode from '../../components/admin/register/RegisterPartnerNode';
import masterData from '../../Backend/master.backend';

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

    const submitForm = (data) => {
        console.log(data);
        if(["manufacturing", "warehouse"].includes(node?.category)){
            console.log("wareouse");
        }else{
            console.log("partner");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(submitForm)} className='space-y-3'>
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
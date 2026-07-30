import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import RegisterWarehouseNode from '../../../components/admin/register/RegisterWarehouseNode';
import RegisterPartnerNode from '../../../components/admin/register/RegisterPartnerNode';
import masterData from '../../../Backend/master.backend';
import { RHFToFormData } from '../../../utils/RHFtoFD';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import business from '../../../Backend/business.fetch';
import ComponentHeader from '../../../components/ComponentHeader';



const RegisterLocation = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { id } = useParams();

    // node type passed by the Location page card's "+" button (or the Store form shortcut)
    const stateNode = (location?.state && typeof location.state === "object") ? location.state : null;


    const { mutateAsync: registerWarehouse, isPending: isPendingWarehouse } = masterData.TQCreateMaster(["tenantRegisteredNodeList", "registeredNodeCount"]);
    const { mutateAsync: updateLocation, isPending: locationIsPending } = masterData.TQUpdateMaster(["tenantRegisteredNodeList", "registeredNodeCount"]);

    const { data: locationData, isLoading: locationIsLoading } = business.TQTenantRegisteredNodeList({ id }, Boolean(id));


    const { register, control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        defaultValues: {
            node: stateNode
        }
    });

    const node = watch("node");


    /** register mode needs a node type from the Location page cards */
    useEffect(() => {
        if (!id && !stateNode) navigate("/admin/location", { replace: true });
    }, []);


    /** prefill fields on update */
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

    }, [id, locationData, locationIsLoading]);



    const submitForm = async (data) => {
        const formData = RHFToFormData(data);

        try {
            const res = id
                ? await updateLocation({ path: `/admin/update-node/${id}`, formData })
                : await registerWarehouse({ path: "/admin/register-node", formData });

            if (res.success) {
                reset({ node: null });

                if (stateNode) navigate(-1);
                else navigate("/admin/location");
            }
        } catch (error) {
            console.log(error)
        }
    };

    const headerLink = [
        { title: "location", link: "/admin/location" },
        { title: id ? "update" : "register" },
    ];

    return (
        <div>
            <ComponentHeader
                showSearch={false}
                headerLink={headerLink}
            />

            <form onSubmit={handleSubmit(submitForm)} className='mt-3 space-y-3'>
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
                    : (id && locationIsLoading)
                        ? <div className="panel min-h-64 animate-pulse" />
                        : null
                }

            </form>
        </div>
    )
}

export default RegisterLocation

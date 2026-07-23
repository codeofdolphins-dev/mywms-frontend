import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import { FiHash, FiFileText, FiCalendar, FiClock, FiMapPin, FiPackage } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { TbTruckDelivery } from 'react-icons/tb';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import Loader from '../../components/loader/Loader';
import AddModal from '../../components/Add.modal';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import CreateStoreForm from '../../components/admin/Store/CreateStoreForm';
import requisition from '../../Backend/requisition.backend';
import masterData from '../../Backend/master.backend';
import fetchData from '../../Backend/fetchData.backend';
import pdf from '../../Backend/downloads/pdf/pdf.download';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { TRADING_DETAILS_ITEM_COLUMN } from './helper';

const HEADER_LINK = [
    { title: "requisition", link: "/requisition" },
    { title: "trading details" },
];

/** trading requisition status colors */
function statusColor(status) {
    switch (status) {
        case "pending":
            return "bg-primary";
        case "dispatched":
            return "bg-info";
        case "closed":
            return "bg-success";
        case "cancelled":
            return "bg-danger";
        default:
            return "bg-secondary";
    }
}

/** single labelled row inside a party card */
const InfoRow = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 text-sm">
        <span className="text-white-dark shrink-0">{label}</span>
        <span className="font-medium text-right break-words">{value || "—"}</span>
    </div>
);

/** buyer / vendor detail card */
const PartyCard = ({ title, Icon, accent, details, tenant, connectionType, isYou }) => {
    const address = details?.address;
    const fullAddress = [
        address?.address,
        address?.district?.name || address?.district,
        address?.state?.name || address?.state,
        address?.pincode,
    ].filter(Boolean).join(", ");

    return (
        <div className="bg-white dark:bg-[#1b2e4b] rounded-2xl shadow-sm border border-[#e0e6ed] dark:border-[#191e3a] overflow-hidden">
            {/* card header */}
            <div className={`flex items-center gap-3 px-5 py-4 ${accent}`}>
                <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center text-gray-700 shrink-0">
                    <Icon size={20} />
                </div>
                <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-gray-600">{title}</p>
                    <p className="font-bold text-gray-900 truncate">{details?.name || tenant || "—"}</p>
                </div>
                {isYou && (
                    <span className="ml-auto badge bg-dark/70 text-white rounded-full text-[10px]">You</span>
                )}
            </div>

            {/* card body */}
            <div className="p-5 space-y-2.5">
                {connectionType && <InfoRow label="Connection" value={<span className="capitalize">{connectionType}</span>} />}
                <InfoRow label="Tenant" value={tenant} />
                <InfoRow label="GST No." value={details?.gst_no} />
                <InfoRow label="License No." value={details?.license_no} />
                <InfoRow
                    label="Location"
                    value={details?.location && (
                        <span className="inline-flex items-center gap-1">
                            <FiMapPin size={13} className="text-danger" /> {details?.location}
                        </span>
                    )}
                />
                <InfoRow label="Address" value={fullAddress} />
            </div>
        </div>
    );
};

const TradingRequisitionDetails = () => {
    const { id = "" } = useParams();

    const [isShow, setIsShow] = useState(false);
    const [store, setStore] = useState(null);

    const { control, watch } = useForm();
    const fgStore = watch("fg_store");

    const { data, isLoading } = requisition.TQTradingRequisitionDetails(id, Boolean(id));
    const details = data?.data;

    /** only vendor side can assign, and only while pending */
    const canAssign = details?.side === "vendor" && details?.status === "pending";

    /** invoice available for both sides once dispatched */
    const canDownloadInvoice = ["dispatched", "closed"].includes(details?.status);
    const { mutateAsync: invoiceDownload, isPending: invoicePending } = pdf.TQTradingInvoicePDFDownload();

    const { data: storeList } = fetchData.TQStoreList({ store_type: "fg_store", isAdmin: true }, canAssign);
    const { mutateAsync: createData, isPending: assignPending } = masterData.TQCreateMaster(["tradingRequisitionDetails", "tradingRequisitionList", "tradingReceiveRequisitionList", "outwardList"]);

    /** assign requisition to FG store — creates a pending outward on this store */
    async function assignFgStore() {
        const res = await createData({
            path: "/requisition/trading/assign-fg",
            formData: {
                id: details?.id,
                store_id: fgStore?.id
            }
        });
        if (res?.success) setIsShow(false);
    }

    if (isLoading) return <Loader />;

    const connection = details?.icReqConnection;
    const items = details?.intercompanyItems ?? [];

    return (
        <div>
            <Helmet><title>Trading Requisition Details | MYWMS</title></Helmet>

            <ComponentHeader
                headerLink={HEADER_LINK}
                showSearch={false}
                addButton={false}
            />

            {/* ── requisition meta header ── */}
            <div className="panel mt-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <FiHash size={18} className="text-primary" />
                                {details?.requisition_no || "—"}
                            </h1>
                            <span className={`badge uppercase rounded-full ${statusColor(details?.status)}`}>
                                {details?.status?.split("_").join(" ")}
                            </span>
                            <span className={`badge uppercase rounded-full ${details?.priority === "high" ? "badge-outline-danger" : details?.priority === "normal" ? "badge-outline-primary" : "badge-outline-secondary"}`}>
                                {details?.priority}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-white-dark flex items-center gap-1.5 mt-2">
                            <FiFileText size={14} />
                            {details?.title || "Untitled Requisition"}
                        </p>
                    </div>

                    <div className="flex items-center gap-5 text-sm">
                        <div className="flex items-center gap-1.5 text-white-dark">
                            <FiClock size={14} />
                            <span>Created {utcToLocal(details?.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 badge badge-outline-danger py-1.5">
                            <FiCalendar size={14} />
                            <span>Deadline: {utcToLocal(details?.required_by_date)}</span>
                        </div>

                        {/* button for Assign to FG Store (outward order) — vendor only */}
                        {canAssign &&
                            <Button
                                className="btn !btn-primary rounded-full py-1 px-1"
                                onClick={() => setIsShow(true)}
                            >
                                <span className='text-xs'>Assign to FG Store</span>
                            </Button>
                        }

                        {/* button for Download Invoice — both sides, once dispatched */}
                        {canDownloadInvoice &&
                            <Button
                                className="btn !btn-primary rounded-full py-1 px-1"
                                loading={invoicePending}
                                onClick={() => invoiceDownload({ requisition_no: details?.requisition_no })}
                            >
                                <span className='text-xs'>Download Invoice</span>
                            </Button>
                        }
                    </div>
                </div>

                {details?.notes && (
                    <div className="mt-4 bg-warning/10 border-l border-warning p-3 rounded-lg text-sm">
                        <span className="text-xs uppercase font-bold tracking-wider text-warning block mb-0.5">Note</span>
                        <p className="text-white-dark">{details?.notes}</p>
                    </div>
                )}
            </div>

            {/* ── buyer & vendor details ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <PartyCard
                    title="Buyer"
                    Icon={HiOutlineBuildingOffice2}
                    accent="bg-primary/10"
                    details={details?.buyerDetails}
                    tenant={connection?.buyer_tenant}
                    connectionType={connection?.connection_type}
                    isYou={details?.side === "buyer"}
                />
                <PartyCard
                    title="Vendor"
                    Icon={TbTruckDelivery}
                    accent="bg-secondary/10"
                    details={details?.vendorDetails}
                    tenant={connection?.vendor_tenant}
                    connectionType={connection?.connection_type}
                    isYou={details?.side === "vendor"}
                />
            </div>

            {/* ── items ── */}
            <div className="panel mt-4">
                <div className="flex items-center gap-2 mb-4">
                    <FiPackage className="text-primary" size={18} />
                    <h3 className="text-base font-bold">Requisition Items</h3>
                    <span className="badge bg-primary/10 text-primary rounded-full ml-auto">
                        {items?.length || 0}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <TableBody
                        columns={TRADING_DETAILS_ITEM_COLUMN}
                        isEmpty={items?.length === 0}
                        showPagination={false}
                    >
                        {items?.map((item, idx) => (
                            <TableRow
                                key={item?.id ?? idx}
                                columns={TRADING_DETAILS_ITEM_COLUMN}
                                row={{
                                    sl: idx + 1,
                                    product: <p className="font-semibold whitespace-nowrap">{item?.product?.name}</p>,
                                    sku: item?.product?.sku,
                                    barcode: item?.product?.barcode,
                                    hsn: item?.product?.hsn_code,
                                    packSize: <p className="whitespace-nowrap">{`${item?.product?.measure ?? ""} ${item?.product?.unit_type ?? ""} ${item?.product?.package_type ?? ""}`.trim()}</p>,
                                    mrp: currencyFormatter(item?.product?.mrp),
                                    qty: item?.qty,
                                }}
                            />
                        ))}
                    </TableBody>
                </div>
            </div>

            {/* Assign FG Store */}
            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Assign FG Store"
                maxWidth='50'
            >
                <div className="panel">
                    <div>
                        {/* fg_store */}
                        <Controller
                            name="fg_store"
                            control={control}
                            rules={{
                                required: "This field is required!!!"
                            }}
                            render={({ field: { ref, value, onChange } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}

                                    label="Select FG Store"
                                    options={storeList?.data}
                                    required={true}
                                    objectReturn={true}

                                    addButton={true}
                                    buttonTitle="Add FG Store"
                                    buttonOnClick={() => setStore("FIN")}
                                />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-10">
                        <Button
                            className="btn !btn-primary rounded-full"
                            onClick={() => setIsShow(false)}
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button
                            className="btn !btn-primary rounded-full"
                            loading={assignPending}
                            disabled={!fgStore}
                            onClick={assignFgStore}
                        >
                            <span>Assign</span>
                        </Button>
                    </div>
                </div>
            </AddModal>

            {/* Add New FG Store */}
            <AddModal
                isShow={Boolean(store)}
                setIsShow={setStore}
                title={"Add New FG Store"}
                maxWidth='75'
            >
                <CreateStoreForm
                    selectedStore={store}
                    setSelectedStore={setStore}
                    isTypeDisabled={true}
                />
            </AddModal>
        </div>
    );
};

export default TradingRequisitionDetails;

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
    FiUser,
    FiLink,
    FiChevronDown,
    FiRefreshCw,
    FiCheckCircle,
} from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import secureLocalStorage from "react-secure-storage";
import fetchData from "../../Backend/fetchData.backend";
import masterData from "../../Backend/master.backend";
import { utcToLocal } from "../../utils/UTCtoLocal";
import TableBody from "../../components/table/TableBody";
import TableRow from "../../components/table/TableRow";
import SummaryCard from "./components/Summary.card";
import { CONNECTION_COLUMN } from "./helper";
import ProductList from "./components/ProductList";
import AddModal from "../../components/Add.modal";
import { BiImport } from "react-icons/bi";
import Loader from "../../components/loader/Loader";

// ─── constants ────────────────────────────────────────────────────────────────

const ALL_TYPES = [
    { value: "all", label: "All Types" },
    { value: "pending", label: "Pending" },
    { value: "supplier", label: "Supplier" },
    { value: "cfa / c&f agent", label: "CFA / C&F Agent" },
    { value: "3pl warehouse", label: "3PL Warehouse" },
    { value: "super stockist", label: "Super Stockist" },
    { value: "dealer", label: "Dealer" },
    { value: "distributor", label: "Distributor" },
    { value: "sub-distributor", label: "Sub-Distributor" },
    { value: "retail warehouse / backroom storage", label: "Retail Warehouse" },
];

// Types that can be assigned as a role (excludes meta-options)
const ROLE_TYPES = ALL_TYPES.filter(t =>
    !["all", "pending"].includes(t.value)
);

// columns are built dynamically inside the component (need access to callbacks)
// so we define the shape here and build render fns in the component.

// ─── helpers ──────────────────────────────────────────────────────────────────

const typeLabel = (type) =>
    ALL_TYPES.find(t => t.value === type)?.label ?? type ?? "—";

const TypeBadge = ({ type }) => {
    const isPending = type === "pending";
    const isSupplier = type === "supplier";
    const base = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize";
    if (isPending)
        return <span className={`${base} bg-amber-100 text-amber-700`}><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />Pending</span>;
    if (isSupplier)
        return <span className={`${base} bg-emerald-100 text-emerald-700`}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />{typeLabel(type)}</span>;
    return <span className={`${base} bg-violet-100 text-violet-700`}><span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />{typeLabel(type)}</span>;
};

const StatusBadge = ({ active }) =>
    active
        ? <span className="badge bg-success text-white text-xs">Active</span>
        : <span className="badge bg-warning text-white text-xs">Pending</span>;

const RoleChip = ({ isBuyer }) =>
    isBuyer
        ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            <HiOutlineBuildingOffice2 size={11} />Buyer
        </span>
        : <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            <TbTruckDelivery size={11} />Vendor
        </span>;

// ─── Role-assign dropdown ─────────────────────────────────────────────────────
// Shows for the BUYER side on any connection so they can assign/change role.
// Shows for the VENDOR side only on PENDING connections (to accept).

const RoleAssignDropdown = ({ connection, myTenant, onUpdate, isUpdating }) => {
    const [selected, setSelected] = useState("");

    const iAmBuyer = connection.parent_tenant === myTenant;
    const iAmVendor = connection.child_tenant === myTenant;
    const isPending = connection.connection_type === "pending";

    // Buyer can always assign / re-assign role
    // Vendor can only accept a pending request
    const canAssign = iAmBuyer || (iAmVendor && isPending);
    if (!canAssign) return <span className="text-gray-300 text-xs">—</span>;

    const placeholder = isPending ? "Accept as…" : "Change role…";
    const selectStyle = isPending
        ? "border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-500"
        : "border-gray-200 bg-white text-gray-700 hover:border-primary";

    const handleChange = (e) => {
        const val = e.target.value;
        if (!val) return;
        setSelected(val);
        onUpdate(connection, val);
        // Reset after firing so it shows placeholder again
        setTimeout(() => setSelected(""), 300);
    };

    return (
        <div className="relative inline-flex items-center">
            <select
                disabled={isUpdating}
                value={selected}
                onChange={handleChange}
                className={`
                    appearance-none border rounded-lg text-xs font-semibold
                    px-2.5 py-1.5 pr-7 cursor-pointer
                    focus:outline-none transition-colors
                    ${selectStyle}
                    ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <option value="" disabled>{placeholder}</option>
                {ROLE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                ))}
            </select>
            <FiChevronDown
                size={12}
                className={`absolute right-2 pointer-events-none ${isPending ? "text-amber-600" : "text-gray-400"}`}
            />
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const Connection = () => {
    const myTenant = secureLocalStorage.getItem("tenant");

    const [filterType, setFilterType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [selectTenant, setSelectTenant] = useState(null);

    const params = {
        connection_type: filterType,
        page: currentPage,
        limit,
    };
    const { data: connectionData, isLoading, isFetching, refetch } = fetchData.TQConnectionList(params);

    /** tenant product list */
    const { data: tenantProductData, isLoading: tenantProductDataLoading } = fetchData.TQTenantProductList({ tenant: selectTenant }, Boolean(selectTenant));

    // Separate no-filter call for the summary cards only
    const { data: allData } = fetchData.TQConnectionList();

    const { mutateAsync: updateMutate, isPending: isUpdating } = masterData.TQUpdateMaster(["connectionList"]);

    const list = connectionData?.data ?? [];
    const isEmpty = !isLoading && list.length === 0;

    const allList = allData?.data ?? [];
    const pendingCount = allList.filter(c => c.connection_type === "pending").length;
    const activeCount = allList.filter(c => c.connection_status === true && c.connection_type !== "pending").length;

    // ── update handler ────────────────────────────────────────────────────────
    const handleUpdate = async (conn, newType) => {
        await updateMutate({
            path: `/connection/${conn.id}/type`,
            formData: { connection_type: newType },
        });
    };
    const getName = (conn, side) =>
        conn?.[side]?.tenantDetails?.companyName
        ?? conn?.[side]?.name
        ?? conn?.[`${side}_tenant`]
        ?? "Unknown";
    const getEmail = (conn, side) =>
        conn?.[side]?.tenantDetails?.email
        ?? conn?.[side]?.name
        ?? conn?.[`${side}_tenant`]
        ?? "Unknown";


    if (tenantProductDataLoading) return <Loader />;

    return (
        <div>
            <Helmet><title>My Connections | MYWMS</title></Helmet>

            {/* ── Page header ── */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary">
                        <FiLink size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 leading-tight">My Connections</h1>
                        <p className="text-xs text-gray-400">All partner connections linked to your account</p>
                    </div>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className={`btn btn-outline-secondary btn-sm flex items-center gap-1.5`}
                >
                    <FiRefreshCw size={13} className={`inline-flex ${isFetching ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* ── Summary cards ── */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                    {
                        label: "Total",
                        value: allList.length,
                        color: "from-primary/10 to-primary/5",
                        textColor: "text-primary",
                        icon: <FiLink size={18} />,
                    },
                    {
                        label: "Active",
                        value: activeCount,
                        color: "from-emerald-100 to-emerald-50",
                        textColor: "text-emerald-600",
                        icon: <FiCheckCircle size={18} />,
                    },
                    {
                        label: "Pending",
                        value: pendingCount,
                        color: "from-amber-100 to-amber-50",
                        textColor: "text-amber-600",
                        icon: <FiUser size={18} />,
                    },
                ].map((card) => <SummaryCard key={card.label} card={card} />)}
            </div>

            {/* ── Main table panel ── */}
            <div className="panel">
                {/* filter bar */}
                <div className="flex items-center justify-between mb-4 gap-4">
                    <p className="text-sm font-semibold text-gray-700">Connection Requests</p>

                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-200 rounded-lg py-1.5 pl-3 pr-8 text-sm appearance-none focus:outline-none focus:border-primary transition"
                        >
                            {ALL_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        <FiChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* table */}
                <TableBody
                    columns={CONNECTION_COLUMN}
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    totalPage={connectionData?.pagination?.totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                >
                    {list.map((conn) => {
                        const iAmParent = conn.parent_tenant === myTenant;
                        const partnerName = iAmParent ? getName(conn, "child") : getName(conn, "parent");
                        const partnerId = iAmParent ? getEmail(conn, "child") : getEmail(conn, "parent");

                        return <TableRow
                            key={conn.id}
                            columns={CONNECTION_COLUMN}
                            row={{
                                partner: (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                            <FiUser size={13} />
                                        </div>
                                        <div>
                                            <p className="font-semibold truncate max-w-[150px]">{partnerName}</p>
                                            <p className="text-xs text-gray-400 font-mono truncate max-w-[150px]">{partnerId}</p>
                                        </div>
                                    </div>
                                ),
                                role: (<RoleChip
                                    isBuyer={
                                        (conn.parent_tenant === myTenant && conn.connection_type === "supplier") ||
                                        (conn.parent_tenant !== myTenant && conn.connection_type !== "supplier")
                                    }
                                />),
                                connection_type: <TypeBadge type={conn.connection_type} />,
                                connection_status: <StatusBadge active={conn.connection_status} />,
                                createdAt: <span className="text-xs text-gray-500 whitespace-nowrap">{utcToLocal(conn.createdAt)}</span>,
                                assignRole: (
                                    conn.connection_status ? "-" : (
                                        <RoleAssignDropdown
                                            connection={conn}
                                            myTenant={myTenant}
                                            onUpdate={handleUpdate}
                                            isUpdating={isUpdating}
                                        />
                                    )
                                ),
                                action: (
                                    <div className="flex items-center justify-center">
                                        {(conn.connection_type !== "supplier" && conn.parent_tenant !== myTenant) ?
                                            <BiImport
                                                size={20}
                                                onClick={() => setSelectTenant(conn.parent_tenant)}
                                                className="cursor-pointer"
                                                title="Import Products"
                                            />
                                            : "no action required"
                                        }
                                    </div>
                                )
                            }}
                        />
                    })}
                </TableBody>
            </div>

            <AddModal
                isShow={Boolean(selectTenant)}
                setIsShow={setSelectTenant}
                noEffect={true}
            >
                <ProductList
                    onClose={() => setSelectTenant(null)}
                    products={tenantProductData?.data}
                />
            </AddModal>

        </div>
    );
};

export default Connection;
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
    FiSearch,
    FiLink,
    FiRefreshCw,
    FiUser,
    FiMail,
    FiCheckCircle,
    FiClock,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import fetchData from "../../Backend/fetchData.backend";
import masterData from "../../Backend/master.backend";

import ConnectRoleModal from "../../components/ConnectRoleModal";
import Loader from "../../components/loader/Loader";
import TableBody from "../../components/table/TableBody";
import TableRow from "../../components/table/TableRow";

const BROWSE_COLUMN = [
    { key: "company", label: "Company" },
    { key: "status", label: "Connection Status" },
    { key: "action", label: "Action", align: "center" }
];

// ─── Connection status helpers ────────────────────────────────────────────────

const getConnectionInfo = (conn) => {
    if (!conn) return { status: "none", label: "Not Connected", color: "gray" };
    if (conn.connection_status && conn.connection_type !== "pending") {
        return {
            status: "active",
            label: `Connected · ${conn.connection_type}`,
            color: "emerald",
        };
    }
    return { status: "pending", label: "Pending", color: "amber" };
};

const StatusBadge = ({ connection }) => {
    const { status, label, color } = getConnectionInfo(connection);

    const colorMap = {
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        gray: "bg-gray-50 text-gray-400 border-gray-200",
    };

    const iconMap = {
        active: <FiCheckCircle size={13} />,
        pending: <FiClock size={13} />,
        none: null,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${colorMap[color]}`}
        >
            {iconMap[status]}
            {label}
        </span>
    );
};


// ─── Main Page ────────────────────────────────────────────────────────────────

const BrowseCompanies = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // ConnectRoleModal state
    const [connectModalShow, setConnectModalShow] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const params = {
        search: debouncedSearch,
        page: currentPage,
        limit,
    };
    const { data: browseData, isLoading, isFetching, refetch } = fetchData.TQBrowseCompanies(params);

    const { mutateAsync, isPending: isConnecting } = masterData.TQUpdateMaster(["browseCompanies", "connectionList"]);

    const list = browseData?.data ?? [];
    const isEmpty = !isLoading && list.length === 0;

    const handleConnect = (company) => {
        setSelectedCompany(company);
        setConnectModalShow(true);
    };

    const handleConfirm = async (role, _item) => {
        if (!selectedCompany) return;

        if (role === "supplier") {
            await mutateAsync({
                path: "/connection/supplier",
                formData: {
                    parent_tenant: selectedCompany.tenant,
                    connection_type: role,
                },
            });
        }

        if (role === "trader") {
            await mutateAsync({
                path: "/connection/trader",
                formData: {
                    vendor_tenant: selectedCompany.tenant,
                    connection_type: role,
                },
            });
        }
    };


    return (
        <div>
            <Helmet>
                <title>Browse Companies | MYWMS</title>
            </Helmet>

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center text-secondary">
                        <HiOutlineBuildingOffice2 size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 leading-tight">
                            Browse Companies
                        </h1>
                        <p className="text-xs text-gray-400">
                            Discover companies and send connection requests
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="btn btn-outline-secondary btn-sm flex items-center gap-1.5"
                >
                    <FiRefreshCw
                        size={13}
                        className={`inline-flex ${isFetching ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* ── Search Bar ── */}
            <div className="panel mb-5">
                <div className="relative">
                    <FiSearch
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search companies by name or email…"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                            transition-all duration-200 placeholder:text-gray-300"
                    />
                    {debouncedSearch && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            {browseData?.pagination?.totalItems ?? 0} result(s)
                        </span>
                    )}
                </div>
            </div>

            {/* ── Company List ── */}
            <div className="panel">
                <TableBody
                    columns={BROWSE_COLUMN}
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    totalPage={browseData?.pagination?.totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                >
                    {list.map((company) => {
                        const info = getConnectionInfo(company.connection);
                        const canConnect = info.status === "none";

                        return (
                            <TableRow
                                key={company.id}
                                columns={BROWSE_COLUMN}
                                row={{
                                    company: (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center text-primary shrink-0">
                                                <HiOutlineBuildingOffice2 size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-800 text-sm truncate max-w-[180px] leading-tight">
                                                    {company.companyName}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <FiMail size={11} className="text-gray-300 shrink-0" />
                                                    <p className="text-xs text-gray-400 truncate max-w-[160px]">
                                                        {company.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    status: <StatusBadge connection={company.connection} />,
                                    action: (
                                        <div className="flex items-center justify-center">
                                            {canConnect ? (
                                                <button
                                                    onClick={() => handleConnect(company)}
                                                    disabled={isConnecting}
                                                    className={`
                                                        px-4 py-1.5 rounded-lg text-xs font-semibold
                                                        bg-primary text-white
                                                        hover:opacity-90 active:scale-[0.97]
                                                        transition-all duration-200 shadow-sm hover:shadow-md
                                                        ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}
                                                    `}
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <FiLink size={12} />
                                                        Connect
                                                    </span>
                                                </button>
                                            ) : (
                                                <span className="text-gray-300 text-xs">—</span>
                                            )}
                                        </div>
                                    ),
                                }}
                            />
                        );
                    })}
                </TableBody>
            </div>

            {/* ── Connect Role Modal ── */}
            <ConnectRoleModal
                isShow={connectModalShow}
                setIsShow={setConnectModalShow}
                rfqItem={{
                    meta: { name: selectedCompany?.companyName },
                    buyer_tenant: selectedCompany?.tenant,
                }}
                allowedRoles={["trader"]}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default BrowseCompanies;

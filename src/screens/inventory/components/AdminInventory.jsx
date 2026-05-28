import React, { useState, useMemo } from 'react';
import TableBody from '../../../components/table/TableBody';
import TableRow from '../../../components/table/TableRow';
import AddModal from '../../../components/Add.modal';
import { INVENTORY_COLUMN, INVENTORY_BATCH_COLUMN } from '../../../utils/helper';
import { currencyFormatter } from '../../../utils/currencyFormatter';
import {
    FiPackage, FiAlertTriangle, FiTrendingUp, FiTrendingDown,
    FiBox, FiCalendar, FiLayers, FiEye, FiFilter,
    FiChevronDown, FiSearch
} from 'react-icons/fi';
import { BsBoxSeam, BsExclamationTriangle } from 'react-icons/bs';
import { MdOutlineInventory2, MdOutlineWarehouse } from 'react-icons/md';
import { HiOutlineCube } from 'react-icons/hi';
import Tippy from '@tippyjs/react';
import ComponentHeader from '../../../components/ComponentHeader';
import StatCard from '../../../components/inventory/inventoryCard';
import BulkCreationModal from '../../../components/inventory/BulkCreation.modal';
import inventory from '../../../Backend/business.fetch copy';

// ─── Helpers ────────────────────────────────────────────────────────────────────
function getStockStatus(item) {
    if (item.totalQty === 0) return "out_of_stock";
    if (item.totalQty <= item.reorderLevel * 0.5) return "critical";
    if (item.totalQty <= item.reorderLevel) return "low_stock";
    return "in_stock";
}

function getStatusBadge(status) {
    const map = {
        in_stock: { label: "In Stock", cls: "bg-success" },
        low_stock: { label: "Low Stock", cls: "bg-warning" },
        critical: { label: "Critical", cls: "bg-danger" },
        out_of_stock: { label: "Out of Stock", cls: "bg-dark" },
    };
    const s = map[status] || map.in_stock;
    return <span className={`badge uppercase rounded-full text-[10px] tracking-wide whitespace-nowrap text-nowrap ${s.cls}`}>{s.label}</span>;
}

function getDaysToExpiry(expiryDate) {
    if (!expiryDate || expiryDate === "N/A") return null;
    const now = new Date();
    const exp = new Date(expiryDate);
    const diffMs = exp - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function getBatchStatus(expiryDate) {
    const days = getDaysToExpiry(expiryDate);
    if (days === null) return <span className="badge bg-secondary rounded-full text-[10px]">No Expiry</span>;
    if (days <= 0) return <span className="badge bg-dark rounded-full text-[10px]">Expired</span>;
    if (days <= 90) return <span className="badge bg-danger rounded-full text-[10px]">Expiring Soon</span>;
    if (days <= 180) return <span className="badge bg-warning rounded-full text-[10px]">Monitor</span>;
    return <span className="badge bg-success rounded-full text-[10px]">Good</span>;
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === "N/A") return "N/A";
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}

function formatQty(qty) {
    return qty?.toLocaleString('en-IN') ?? '0';
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────────

function computeStats(items) {
    let totalProducts = items.length;
    let totalSKUs = new Set(items.map(i => i.sku)).size;
    let totalStockValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let expiringCount = 0;
    let totalQty = 0;

    items.forEach(item => {
        const val = item.totalQty * item.unitPrice;
        totalStockValue += val;
        totalQty += item.totalQty;
        const status = getStockStatus(item);
        if (status === "low_stock" || status === "critical") lowStockCount++;
        if (status === "out_of_stock") outOfStockCount++;
        // count batches expiring in < 90 days
        item.batches?.forEach(b => {
            const d = getDaysToExpiry(b.expiryDate);
            if (d !== null && d > 0 && d <= 90) expiringCount++;
        });
    });

    return { totalProducts, totalSKUs, totalStockValue, lowStockCount, outOfStockCount, expiringCount, totalQty };
}

// ─── Component ──────────────────────────────────────────────────────────────────

const headerLink = [{ title: "inventory" }];

const AdminInventory = () => {
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isShow, setIsShow] = useState(false);
    const [isBulkShow, setIsBulkShow] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [productTypeFilter, setProductTypeFilter] = useState('all');

    const { data, isLoading } = inventory.TQInventoryFullList();
    const inventoryData = useMemo(() => data?.data ?? [], [data]);

    // Compute all unique categories for filter
    const categories = useMemo(() => {
        const cats = [...new Set(inventoryData.map(i => i.category))];
        return cats.sort();
    }, [inventoryData]);

    // Filter
    const filteredData = useMemo(() => {
        let data = [...inventoryData];

        // search
        if (debounceSearch) {
            const s = debounceSearch.toLowerCase();
            data = data.filter(item =>
                item.name.toLowerCase().includes(s) ||
                item.sku.toLowerCase().includes(s) ||
                item.barcode.includes(s) ||
                item.category.toLowerCase().includes(s) ||
                item.brand.toLowerCase().includes(s)
            );
        }

        // status filter
        if (statusFilter !== 'all') {
            data = data.filter(item => getStockStatus(item) === statusFilter);
        }

        // category filter
        if (categoryFilter !== 'all') {
            data = data.filter(item => item.category === categoryFilter);
        }

        // product type filter
        if (productTypeFilter !== 'all') {
            data = data.filter(item => item.product_type === productTypeFilter);
        }

        return data;
    }, [inventoryData, debounceSearch, statusFilter, categoryFilter, productTypeFilter]);

    const stats = useMemo(() => computeStats(inventoryData), [inventoryData]);
    const isEmpty = filteredData.length < 1;

    function handleViewBatches(product) {
        setSelectedProduct(product);
        setIsShow(true);
    }

    return (
        <>
            {/* Header */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder="Search by product, SKU, barcode, category..."
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                addButton2={true}
                btn2Title="Bulk Creation"
                btn2OnClick={() => setIsBulkShow(true)}
            />

            {/* ─── Dashboard KPI Cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-5">
                <StatCard
                    icon={<MdOutlineInventory2 size={22} />}
                    label="Total Products"
                    value={formatQty(stats.totalProducts)}
                    accent="primary"
                />
                <StatCard
                    icon={<FiPackage size={22} />}
                    label="Total Stock Qty"
                    value={formatQty(stats.totalQty)}
                    accent="info"
                />
                <StatCard
                    icon={<FiTrendingUp size={22} />}
                    label="Total Stock Value"
                    value={currencyFormatter(stats.totalStockValue)}
                    accent="success"
                />
                <StatCard
                    icon={<FiTrendingDown size={22} />}
                    label="Low Stock Items"
                    value={stats.lowStockCount}
                    accent="warning"
                />
                <StatCard
                    icon={<BsExclamationTriangle size={22} />}
                    label="Out of Stock"
                    value={stats.outOfStockCount}
                    accent="danger"
                />
                <StatCard
                    icon={<FiCalendar size={22} />}
                    label="Expiring Soon"
                    value={stats.expiringCount}
                    accent="secondary"
                    subtitle="Within 90 days"
                />
            </div>

            {/* ─── Filters Row ──────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiFilter size={14} />
                    <span className="font-semibold">Filters:</span>
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        className="form-select form-select-sm text-xs pr-8 rounded-full border-gray-200 bg-white min-w-[140px]"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="all">All Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="critical">Critical</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <select
                        className="form-select form-select-sm text-xs pr-8 rounded-full border-gray-200 bg-white min-w-[160px]"
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        className="form-select form-select-sm text-xs pr-8 rounded-full border-gray-200 bg-white min-w-[140px]"
                        value={productTypeFilter}
                        onChange={(e) => { setProductTypeFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="all">All Product Type</option>
                        <option value="raw">Raw</option>
                        <option value="finished">Finished</option>
                    </select>
                </div>

                {/* Results count */}
                <div className="ml-auto text-xs text-gray-400">
                    Showing <span className="font-bold text-gray-700">{filteredData.length}</span> of {inventoryData.length} products
                </div>
            </div>

            {/* ─── Inventory Table ──────────────────────────────────────────── */}
            <div className="panel mt-4 z-0 min-h-64">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-700 flex items-center gap-2">
                        <MdOutlineWarehouse className="text-primary" size={20} />
                        Product Inventory
                    </h2>
                    <div className="flex items-center gap-3">
                        {stats.lowStockCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 bg-warning/10 text-warning text-xs font-semibold px-3 py-1.5 rounded-full">
                                <FiAlertTriangle size={13} />
                                {stats.lowStockCount} items below reorder level
                            </span>
                        )}
                        {stats.outOfStockCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 bg-danger/10 text-danger text-xs font-semibold px-3 py-1.5 rounded-full">
                                <BsExclamationTriangle size={13} />
                                {stats.outOfStockCount} out of stock
                            </span>
                        )}
                    </div>
                </div>

                <TableBody
                    columns={INVENTORY_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={Math.ceil(filteredData.length / limit) || 1}
                    isEmpty={isEmpty}
                    isLoading={isLoading}
                >
                    {filteredData
                        .slice((currentPage - 1) * limit, currentPage * limit)
                        .map((item) => {
                            const status = getStockStatus(item);
                            const isLow = status === 'low_stock' || status === 'critical';
                            const isOut = status === 'out_of_stock';

                            return (
                                <TableRow
                                    key={item.id}
                                    columns={INVENTORY_COLUMN}
                                    className={
                                        isOut
                                            ? "bg-danger/[0.03] hover:!bg-danger/[0.07]"
                                            : isLow
                                                ? "bg-warning/[0.03] hover:!bg-warning/[0.07]"
                                                : ""
                                    }
                                    row={{
                                        product: (
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isOut ? 'bg-danger/10 text-danger' : isLow ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                                                    <HiOutlineCube size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-gray-800 truncate max-w-[180px]">{item.name}</p>
                                                    <p className="text-[16px] text-gray-400 font-mono">{item.barcode}</p>
                                                </div>
                                            </div>
                                        ),
                                        sku: (
                                            <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded text-gray-600 whitespace-nowrap">{item.sku}</span>
                                        ),
                                        category: (
                                            <span className="text-xs bg-primary/5 text-primary font-semibold px-2 py-1 rounded-full whitespace-nowrap">{item.category}</span>
                                        ),
                                        subCategory: (
                                            <span className="text-xs bg-secondary/5 text-secondary font-semibold px-2 py-1 rounded-full whitespace-nowrap">{item.subCategory}</span>
                                        ),
                                        product_type: (
                                            <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-full capitalize">
                                                {item.product_type}
                                            </span>
                                        ),
                                        location: (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <MdOutlineWarehouse size={14} className="text-gray-400 shrink-0" />
                                                <span className="truncate max-w-[120px]">{item.location}</span>
                                            </div>
                                        ),
                                        totalQty: (
                                            <span className={`font-bold text-sm ${isOut ? 'text-danger' : isLow ? 'text-warning' : 'text-gray-700'}`}>
                                                {formatQty(item.totalQty)}
                                            </span>
                                        ),
                                        availableQty: (
                                            <span className="text-sm font-semibold text-success">{formatQty(item.availableQty)}</span>
                                        ),
                                        reservedQty: (
                                            <span className="text-sm text-secondary font-medium">{formatQty(item.reservedQty)}</span>
                                        ),
                                        reorderLevel: (
                                            <span className="text-xs text-gray-500">{formatQty(item.reorderLevel)}</span>
                                        ),
                                        stockStatus: getStatusBadge(status),
                                        unitPrice: (
                                            <span className="text-sm font-medium text-gray-600">{currencyFormatter(item.unitPrice)}</span>
                                        ),
                                        stockValue: (
                                            <span className="text-sm font-bold text-gray-800">{currencyFormatter(item.totalQty * item.unitPrice)}</span>
                                        ),
                                        action: (
                                            <Tippy content="View Batches" placement="left">
                                                <button
                                                    className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200"
                                                    onClick={() => handleViewBatches(item)}
                                                >
                                                    <FiEye size={15} />
                                                </button>
                                            </Tippy>
                                        ),
                                    }}
                                />
                            );
                        })}
                </TableBody>
            </div>

            {/* ─── Batch Details Modal ──────────────────────────────────────── */}
            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Batch & Lot Details"
                maxWidth="80"
            >
                {selectedProduct && (
                    <div className="space-y-5">
                        {/* Product summary header */}
                        <div className="bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent rounded-xl p-5 border border-primary/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{selectedProduct.name}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedProduct.sku}</span>
                                        <span>{selectedProduct.brand}</span>
                                        <span>•</span>
                                        <span>{selectedProduct.category}</span>
                                    </div>
                                </div>
                                {getStatusBadge(getStockStatus(selectedProduct))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                                <MiniStat label="Total Qty" value={formatQty(selectedProduct.totalQty)} />
                                <MiniStat label="Available" value={formatQty(selectedProduct.availableQty)} color="text-success" />
                                <MiniStat label="Reserved" value={formatQty(selectedProduct.reservedQty)} color="text-secondary" />
                                <MiniStat label="Stock Value" value={currencyFormatter(selectedProduct.totalQty * selectedProduct.unitPrice)} color="text-primary" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-400">
                                    Reorder Level: <span className="text-gray-600 font-semibold">{formatQty(selectedProduct.reorderLevel)}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Location: <span className="text-gray-600 font-semibold">{selectedProduct.location}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Last Inward: <span className="text-gray-600 font-semibold">{formatDate(selectedProduct.lastInwardDate)}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Last Outward: <span className="text-gray-600 font-semibold">{formatDate(selectedProduct.lastOutwardDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Batch table */}
                        <div className="panel z-0 min-h-40">
                            <div className="flex items-center gap-2 mb-3">
                                <FiLayers className="text-primary" size={16} />
                                <h4 className="text-sm font-bold text-gray-700">
                                    Batch / Lot Breakdown
                                    <span className="ml-2 text-xs font-normal text-gray-400">
                                        ({selectedProduct.batches?.length || 0} batches)
                                    </span>
                                </h4>
                            </div>

                            <TableBody
                                columns={INVENTORY_BATCH_COLUMN}
                                showPagination={false}
                                isEmpty={!selectedProduct.batches?.length}
                                isLoading={false}
                            >
                                {selectedProduct.batches?.map((batch, idx) => {
                                    const days = getDaysToExpiry(batch.expiryDate);
                                    return (
                                        <TableRow
                                            key={batch.batchNo}
                                            columns={INVENTORY_BATCH_COLUMN}
                                            className={
                                                days !== null && days <= 0
                                                    ? "bg-danger/[0.04]"
                                                    : days !== null && days <= 90
                                                        ? "bg-warning/[0.04]"
                                                        : ""
                                            }
                                            row={{
                                                batchNo: (
                                                    <span className="font-mono text-xs font-semibold text-gray-700">{batch.batchNo}</span>
                                                ),
                                                qty: (
                                                    <span className="font-bold text-sm">{formatQty(batch.qty)}</span>
                                                ),
                                                mfgDate: (
                                                    <span className="text-xs text-gray-500">{formatDate(batch.mfgDate)}</span>
                                                ),
                                                expiryDate: (
                                                    <span className={`text-xs font-semibold ${days !== null && days <= 90 ? 'text-danger' : 'text-gray-600'}`}>
                                                        {formatDate(batch.expiryDate)}
                                                    </span>
                                                ),
                                                daysToExpiry: days !== null
                                                    ? (
                                                        <span className={`text-xs font-bold ${days <= 0 ? 'text-dark' : days <= 90 ? 'text-danger' : days <= 180 ? 'text-warning' : 'text-success'}`}>
                                                            {days <= 0 ? 'Expired' : `${days}d`}
                                                        </span>
                                                    )
                                                    : <span className="text-xs text-gray-400">—</span>,
                                                grnRef: (
                                                    <span className="font-mono text-xs text-primary hover:underline cursor-pointer">{batch.grnRef}</span>
                                                ),
                                                storageLocation: (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MdOutlineWarehouse size={13} className="text-gray-400" />
                                                        {batch.storageLocation}
                                                    </div>
                                                ),
                                                batchStatus: getBatchStatus(batch.expiryDate),
                                            }}
                                        />
                                    );
                                })}
                            </TableBody>
                        </div>
                    </div>
                )}
            </AddModal>


            {/* ─── Bulk creation modal ──────────────────────────────────────── */}
            <AddModal
                isShow={isBulkShow}
                setIsShow={setIsBulkShow}
                title="Bulk Creation"
                maxWidth='60'
                placement='start'  // top | start | center | end
            >
                <BulkCreationModal
                    onCancel={() => setIsBulkShow(false)}
                />
            </AddModal>
        </>
    );
};

export default AdminInventory;


// ─── Sub-components ─────────────────────────────────────────────────────────────

function MiniStat({ label, value, color = "text-gray-800" }) {
    return (
        <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            <p className={`text-base font-bold ${color} mt-0.5`}>{value}</p>
        </div>
    );
}
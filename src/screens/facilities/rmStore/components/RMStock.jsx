import React, { useState, useMemo } from 'react';
import ComponentHeader from '../../../../components/ComponentHeader';
import TableBody from '../../../../components/table/TableBody';
import TableRow from '../../../../components/table/TableRow';
import AddModal from '../../../../components/Add.modal';
import { RM_INVENTORY_COLUMN, RM_INVENTORY_BATCH_COLUMN } from '../../../../utils/helper';
import { currencyFormatter } from '../../../../utils/currencyFormatter';
import {
    FiPackage, FiAlertTriangle, FiTrendingUp, FiTrendingDown,
    FiCalendar, FiLayers, FiEye, FiFilter, FiSearch
} from 'react-icons/fi';
import { BsExclamationTriangle } from 'react-icons/bs';
import { MdOutlineInventory2, MdOutlineWarehouse } from 'react-icons/md';
import { HiOutlineCube } from 'react-icons/hi';
import Tippy from '@tippyjs/react';
import StatCard from '../../../../components/inventory/inventoryCard';
import BulkCreationModal from '../../../../components/inventory/BulkCreation.modal';
import inventory from '../../../../Backend/business.fetch copy';

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * The API returns products with nested batches[].
 * Aggregate qty/price fields so the rest of the component works uniformly.
 * When batches have different unit prices, we store both min and max
 * so the UI can display a price range.
 */
function enrichProduct(product) {
    const batches = product?.batches ?? [];
    const totalQty = batches.reduce(
        (sum, b) => sum + parseFloat(b.available_qty ?? 0) + parseFloat(b.reserved_qty ?? 0),
        0
    );
    const availableQty = batches.reduce((sum, b) => sum + parseFloat(b.available_qty ?? 0), 0);
    const reservedQty = batches.reduce((sum, b) => sum + parseFloat(b.reserved_qty ?? 0), 0);

    // Price range — min & max across batches
    const prices = batches.map(b => parseFloat(b.unit_price ?? 0)).filter(p => p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    // Weighted stock value = sum of each batch's (qty × unit_price)
    const stockValue = batches.reduce((sum, b) => {
        const batchQty = parseFloat(b.available_qty ?? 0) + parseFloat(b.reserved_qty ?? 0);
        return sum + batchQty * parseFloat(b.unit_price ?? 0);
    }, 0);

    return { ...product, totalQty, availableQty, reservedQty, minPrice, maxPrice, stockValue };
}

/** Format unit price — shows a range when min ≠ max */
function formatPriceRange(minPrice, maxPrice) {
    if (minPrice === maxPrice) return currencyFormatter(maxPrice);
    return `${currencyFormatter(minPrice)} – ${currencyFormatter(maxPrice)}`;
}

function getStockStatus(item) {
    if (item.totalQty === 0) return 'out_of_stock';
    if (item.totalQty <= item.reorder_level * 0.5) return 'critical';
    if (item.totalQty <= item.reorder_level) return 'low_stock';
    return 'in_stock';
}

function getStatusBadge(status) {
    const map = {
        in_stock: { label: 'In Stock', cls: 'bg-success' },
        low_stock: { label: 'Low Stock', cls: 'bg-warning' },
        critical: { label: 'Critical', cls: 'bg-danger' },
        out_of_stock: { label: 'Out of Stock', cls: 'bg-dark' },
    };
    const s = map[status] || map.in_stock;
    return <span className={`badge uppercase text-nowrap rounded-full text-[10px] tracking-wide ${s.cls}`}>{s.label}</span>;
}

function getDaysToExpiry(expiryDate) {
    if (!expiryDate || expiryDate === 'N/A') return null;
    const now = new Date();
    const exp = new Date(expiryDate);
    return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
}

function getBatchStatus(expiryDate) {
    const days = getDaysToExpiry(expiryDate);
    if (days === null) return <span className="badge bg-secondary rounded-full text-[10px] text-nowrap">No Expiry</span>;
    if (days <= 0) return <span className="badge bg-dark rounded-full text-[10px] text-nowrap">Expired</span>;
    if (days <= 90) return <span className="badge bg-danger rounded-full text-[10px] text-nowrap">Expiring Soon</span>;
    if (days <= 180) return <span className="badge bg-warning rounded-full text-[10px] text-nowrap">Monitor</span>;
    return <span className="badge bg-success rounded-full text-[10px] text-nowrap">Good</span>;
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === 'N/A') return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatQty(qty) {
    if (qty === undefined || qty === null) return '0';
    return Number(qty).toLocaleString('en-IN');
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────────

function computeStats(items) {
    let totalProducts = items?.length ?? 0;
    let totalStockValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let expiringCount = 0;
    let totalQty = 0;

    items?.forEach(item => {
        totalStockValue += item?.stockValue ?? 0;
        totalQty += item?.totalQty ?? 0;
        const status = getStockStatus(item);
        if (status === 'low_stock' || status === 'critical') lowStockCount++;
        if (status === 'out_of_stock') outOfStockCount++;
        item.batches?.forEach(b => {
            const d = getDaysToExpiry(b.expiry_date);
            if (d !== null && d > 0 && d <= 90) expiringCount++;
        });
    });

    return { totalProducts, totalStockValue, lowStockCount, outOfStockCount, expiringCount, totalQty };
}

// ─── Component ──────────────────────────────────────────────────────────────────

const RMstock = () => {
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isShow, setIsShow] = useState(false);
    const [isBulkShow, setIsBulkShow] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, isLoading } = inventory.TQInventoryList();

    // Enrich each product by aggregating qty/price from its batches[]
    const inventoryData = useMemo(() => {
        return data?.data?.map(enrichProduct) ?? [];
    }, [data]);

    // Filter
    const filteredData = useMemo(() => {
        let result = [...inventoryData];

        // search on real API fields
        if (debounceSearch) {
            const s = debounceSearch.toLowerCase();
            result = result.filter(item =>
                item?.name?.toLowerCase().includes(s) ||
                item?.sku?.toLowerCase().includes(s) ||
                item?.unit_type?.toLowerCase().includes(s)
            );
        }

        // status filter
        if (statusFilter !== 'all') {
            result = result.filter(item => getStockStatus(item) === statusFilter);
        }

        return result;
    }, [inventoryData, debounceSearch, statusFilter]);

    const stats = useMemo(() => computeStats(inventoryData), [inventoryData]);
    const isEmpty = filteredData.length < 1;

    function handleViewBatches(product) {
        setSelectedProduct(product);
        setIsShow(true);
    }

    return (
        <>
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

                {/* Search */}
                <div className="relative">
                    <FiSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        className="form-input form-input-sm text-xs pl-7 rounded-full border-gray-200 bg-white min-w-[200px]"
                        placeholder="Search by name or SKU..."
                        value={debounceSearch}
                        onChange={e => { setDebounceSearch(e.target.value); setCurrentPage(1); }}
                    />
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
                    columns={RM_INVENTORY_COLUMN}
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
                                    columns={RM_INVENTORY_COLUMN}
                                    className={
                                        isOut
                                            ? 'bg-danger/[0.03] hover:!bg-danger/[0.07]'
                                            : isLow
                                                ? 'bg-warning/[0.03] hover:!bg-warning/[0.07]'
                                                : ''
                                    }
                                    row={{
                                        product: (
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isOut ? 'bg-danger/10 text-danger' : isLow ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                                                    <HiOutlineCube size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-gray-800 truncate max-w-[180px]">{item?.name}</p>
                                                    <p className="text-[11px] text-gray-400 font-mono">{item?.unit_type ?? '—'}</p>
                                                </div>
                                            </div>
                                        ),
                                        sku: (
                                            <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded text-gray-600">{item?.sku}</span>
                                        ),
                                        category: (
                                            <span className="text-xs bg-primary/5 text-primary font-semibold px-2 py-1 rounded-full capitalize">
                                                {item?.product_type ?? '—'}
                                            </span>
                                        ),
                                        totalQty: (
                                            <span className={`font-bold text-sm ${isOut ? 'text-danger' : isLow ? 'text-warning' : 'text-gray-700'}`}>
                                                {formatQty(item?.totalQty)}
                                            </span>
                                        ),
                                        availableQty: (
                                            <span className="text-sm font-semibold text-success">{formatQty(item?.availableQty)}</span>
                                        ),
                                        reservedQty: (
                                            <span className="text-sm text-secondary font-medium">{formatQty(item?.reservedQty)}</span>
                                        ),
                                        reorderLevel: (
                                            <span className="text-xs text-gray-500">{formatQty(item?.reorder_level)}</span>
                                        ),
                                        stockStatus: getStatusBadge(status),
                                        unitPrice: (
                                            <span className="text-sm font-medium text-gray-600 text-nowrap">
                                                {formatPriceRange(item?.minPrice, item?.maxPrice)}
                                            </span>
                                        ),
                                        stockValue: (
                                            <span className="text-sm font-bold text-gray-800">{currencyFormatter(item?.stockValue)}</span>
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
                title="Batch & Lot Details of RAW Materials"
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
                                        <span>{selectedProduct.unit_type}</span>
                                        <span>•</span>
                                        <span className="capitalize">{selectedProduct.product_type}</span>
                                    </div>
                                </div>
                                {getStatusBadge(getStockStatus(selectedProduct))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                                <MiniStat label="Total Qty" value={formatQty(selectedProduct.totalQty)} />
                                <MiniStat label="Available" value={formatQty(selectedProduct.availableQty)} color="text-success" />
                                <MiniStat label="Reserved" value={formatQty(selectedProduct.reservedQty)} color="text-secondary" />
                                <MiniStat label="Stock Value" value={currencyFormatter(selectedProduct.stockValue)} color="text-primary" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-400">
                                    Reorder Level: <span className="text-gray-600 font-semibold">{formatQty(selectedProduct.reorder_level)}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Unit Type: <span className="text-gray-600 font-semibold">{selectedProduct.unit_type ?? '—'}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Total Batches: <span className="text-gray-600 font-semibold">{selectedProduct.batches?.length ?? 0}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Unit Price: <span className="text-gray-600 font-semibold">{formatPriceRange(selectedProduct.minPrice, selectedProduct.maxPrice)}</span>
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
                                columns={RM_INVENTORY_BATCH_COLUMN}
                                showPagination={false}
                                isEmpty={!selectedProduct?.batches?.length}
                                isLoading={false}
                            >
                                {selectedProduct?.batches?.map((batch) => {
                                    const days = getDaysToExpiry(batch?.expiry_date);
                                    return (
                                        <TableRow
                                            key={batch.id}
                                            columns={RM_INVENTORY_BATCH_COLUMN}
                                            className={
                                                days !== null && days <= 0
                                                    ? 'bg-danger/[0.04]'
                                                    : days !== null && days <= 90
                                                        ? 'bg-warning/[0.04]'
                                                        : ''
                                            }
                                            row={{
                                                batchNo: (
                                                    <span className="font-mono text-xs font-semibold text-gray-700">{batch.batch_no}</span>
                                                ),
                                                qty: (
                                                    <span className="font-bold text-sm">
                                                        {formatQty(parseFloat(batch.available_qty ?? 0) + parseFloat(batch.reserved_qty ?? 0))}
                                                    </span>
                                                ),
                                                unitPrice: (
                                                    <span className="text-sm font-medium text-gray-600">{currencyFormatter(parseFloat(batch.unit_price ?? 0))}</span>
                                                ),
                                                mfgDate: (
                                                    <span className="text-xs text-gray-500">{formatDate(batch.mfg_date)}</span>
                                                ),
                                                expiryDate: (
                                                    <span className={`text-xs font-semibold ${days !== null && days <= 90 ? 'text-danger' : 'text-gray-600'}`}>
                                                        {formatDate(batch.expiry_date)}
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
                                                    <span className="font-mono text-xs text-primary">
                                                        {batch.reference_type?.toUpperCase() ?? '—'}
                                                        {batch.reference_id ? ` #${batch.reference_id}` : ''}
                                                    </span>
                                                ),
                                                batchStatus: getBatchStatus(batch.expiry_date),
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
                placement='start'
            >
                <BulkCreationModal
                    onCancel={() => setIsBulkShow(false)}
                />
            </AddModal>
        </>
    );
};

export default RMstock;


// ─── Sub-components ─────────────────────────────────────────────────────────────

function MiniStat({ label, value, color = 'text-gray-800' }) {
    return (
        <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            <p className={`text-base font-bold ${color} mt-0.5`}>{value}</p>
        </div>
    );
}
import React, { useState, useMemo } from 'react';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import AddModal from '../../components/Add.modal';
import { INVENTORY_COLUMN, INVENTORY_BATCH_COLUMN } from '../../utils/helper';
import { currencyFormatter } from '../../utils/currencyFormatter';
import {
    FiPackage, FiAlertTriangle, FiTrendingUp, FiTrendingDown,
    FiBox, FiCalendar, FiLayers, FiEye, FiFilter,
    FiChevronDown, FiSearch
} from 'react-icons/fi';
import { BsBoxSeam, BsExclamationTriangle } from 'react-icons/bs';
import { MdOutlineInventory2, MdOutlineWarehouse } from 'react-icons/md';
import { HiOutlineCube } from 'react-icons/hi';
import Tippy from '@tippyjs/react';
import StatCard from '../../components/inventory/inventoryCard';
import BulkCreationModal from '../../components/inventory/BulkCreation.modal';

// ─── Mock inventory data ───────────────────────────────────────────────────────
const INVENTORY_DATA = [
    {
        id: 1,
        name: "Paracetamol 500mg Tablets",
        sku: "MED-PCM-500",
        barcode: "8901234567890",
        category: "Pharmaceuticals",
        brand: "CurePharma",
        location: "Store A - Rack 3",
        totalQty: 12500,
        availableQty: 10200,
        reservedQty: 2300,
        reorderLevel: 5000,
        unitPrice: 2.50,
        unit: "Strip",
        lastInwardDate: "2026-03-28",
        lastOutwardDate: "2026-04-02",
        batches: [
            { batchNo: "BT-PCM-2601", qty: 5000, mfgDate: "2026-01-15", expiryDate: "2028-01-15", grnRef: "GRN-00284", storageLocation: "Zone-A / Bin-12" },
            { batchNo: "BT-PCM-2602", qty: 4200, mfgDate: "2026-02-10", expiryDate: "2028-02-10", grnRef: "GRN-00301", storageLocation: "Zone-A / Bin-13" },
            { batchNo: "BT-PCM-2503", qty: 3300, mfgDate: "2025-11-05", expiryDate: "2027-11-05", grnRef: "GRN-00198", storageLocation: "Zone-A / Bin-14" },
        ]
    },
    {
        id: 2,
        name: "Amoxicillin 250mg Capsules",
        sku: "MED-AMX-250",
        barcode: "8901234567891",
        category: "Antibiotics",
        brand: "BioGenix",
        location: "Store A - Rack 5",
        totalQty: 800,
        availableQty: 650,
        reservedQty: 150,
        reorderLevel: 1000,
        unitPrice: 8.75,
        unit: "Strip",
        lastInwardDate: "2026-03-15",
        lastOutwardDate: "2026-04-01",
        batches: [
            { batchNo: "BT-AMX-2601", qty: 500, mfgDate: "2026-01-20", expiryDate: "2027-07-20", grnRef: "GRN-00289", storageLocation: "Zone-B / Bin-04" },
            { batchNo: "BT-AMX-2502", qty: 300, mfgDate: "2025-09-10", expiryDate: "2027-03-10", grnRef: "GRN-00172", storageLocation: "Zone-B / Bin-05" },
        ]
    },
    {
        id: 3,
        name: "Surgical Gloves (Large)",
        sku: "SUP-GLV-LRG",
        barcode: "8901234567892",
        category: "Surgical Supplies",
        brand: "MedSafe",
        location: "Store B - Rack 1",
        totalQty: 25000,
        availableQty: 22000,
        reservedQty: 3000,
        reorderLevel: 8000,
        unitPrice: 5.20,
        unit: "Pair",
        lastInwardDate: "2026-04-01",
        lastOutwardDate: "2026-04-05",
        batches: [
            { batchNo: "BT-GLV-2603", qty: 15000, mfgDate: "2026-03-01", expiryDate: "2029-03-01", grnRef: "GRN-00318", storageLocation: "Zone-C / Bin-01" },
            { batchNo: "BT-GLV-2601", qty: 10000, mfgDate: "2026-01-10", expiryDate: "2029-01-10", grnRef: "GRN-00276", storageLocation: "Zone-C / Bin-02" },
        ]
    },
    {
        id: 4,
        name: "Ibuprofen 400mg Tablets",
        sku: "MED-IBU-400",
        barcode: "8901234567893",
        category: "Pharmaceuticals",
        brand: "CurePharma",
        location: "Store A - Rack 3",
        totalQty: 300,
        availableQty: 180,
        reservedQty: 120,
        reorderLevel: 2000,
        unitPrice: 3.10,
        unit: "Strip",
        lastInwardDate: "2026-02-20",
        lastOutwardDate: "2026-04-03",
        batches: [
            { batchNo: "BT-IBU-2601", qty: 200, mfgDate: "2026-02-01", expiryDate: "2028-02-01", grnRef: "GRN-00295", storageLocation: "Zone-A / Bin-15" },
            { batchNo: "BT-IBU-2502", qty: 100, mfgDate: "2025-08-15", expiryDate: "2026-05-15", grnRef: "GRN-00156", storageLocation: "Zone-A / Bin-16" },
        ]
    },
    {
        id: 5,
        name: "IV Saline 500ml",
        sku: "MED-SAL-500",
        barcode: "8901234567894",
        category: "Infusions",
        brand: "AquaMed",
        location: "Cold Store - Shelf 2",
        totalQty: 4800,
        availableQty: 4000,
        reservedQty: 800,
        reorderLevel: 2000,
        unitPrice: 45.00,
        unit: "Bottle",
        lastInwardDate: "2026-03-22",
        lastOutwardDate: "2026-04-04",
        batches: [
            { batchNo: "BT-SAL-2602", qty: 3000, mfgDate: "2026-02-01", expiryDate: "2027-08-01", grnRef: "GRN-00305", storageLocation: "Cold-A / Shelf-2" },
            { batchNo: "BT-SAL-2601", qty: 1800, mfgDate: "2026-01-10", expiryDate: "2027-07-10", grnRef: "GRN-00280", storageLocation: "Cold-A / Shelf-3" },
        ]
    },
    {
        id: 6,
        name: "Disposable Syringes 5ml",
        sku: "SUP-SYR-005",
        barcode: "8901234567895",
        category: "Surgical Supplies",
        brand: "MedSafe",
        location: "Store B - Rack 4",
        totalQty: 50000,
        availableQty: 42000,
        reservedQty: 8000,
        reorderLevel: 10000,
        unitPrice: 3.50,
        unit: "Piece",
        lastInwardDate: "2026-04-02",
        lastOutwardDate: "2026-04-05",
        batches: [
            { batchNo: "BT-SYR-2604", qty: 20000, mfgDate: "2026-04-01", expiryDate: "2030-04-01", grnRef: "GRN-00325", storageLocation: "Zone-D / Bin-01" },
            { batchNo: "BT-SYR-2603", qty: 18000, mfgDate: "2026-03-15", expiryDate: "2030-03-15", grnRef: "GRN-00312", storageLocation: "Zone-D / Bin-02" },
            { batchNo: "BT-SYR-2601", qty: 12000, mfgDate: "2026-01-05", expiryDate: "2030-01-05", grnRef: "GRN-00272", storageLocation: "Zone-D / Bin-03" },
        ]
    },
    {
        id: 7,
        name: "Cetirizine 10mg Tablets",
        sku: "MED-CTZ-010",
        barcode: "8901234567896",
        category: "Antihistamines",
        brand: "AllerFree",
        location: "Store A - Rack 7",
        totalQty: 6200,
        availableQty: 5500,
        reservedQty: 700,
        reorderLevel: 2000,
        unitPrice: 1.80,
        unit: "Strip",
        lastInwardDate: "2026-03-30",
        lastOutwardDate: "2026-04-06",
        batches: [
            { batchNo: "BT-CTZ-2603", qty: 3000, mfgDate: "2026-03-20", expiryDate: "2028-09-20", grnRef: "GRN-00315", storageLocation: "Zone-A / Bin-22" },
            { batchNo: "BT-CTZ-2602", qty: 2000, mfgDate: "2026-02-10", expiryDate: "2028-08-10", grnRef: "GRN-00298", storageLocation: "Zone-A / Bin-23" },
            { batchNo: "BT-CTZ-2501", qty: 1200, mfgDate: "2025-12-01", expiryDate: "2028-06-01", grnRef: "GRN-00245", storageLocation: "Zone-A / Bin-24" },
        ]
    },
    {
        id: 8,
        name: "Digital Thermometer Pro",
        sku: "EQP-THR-PRO",
        barcode: "8901234567897",
        category: "Equipment",
        brand: "ThermoTech",
        location: "Store C - Rack 1",
        totalQty: 150,
        availableQty: 120,
        reservedQty: 30,
        reorderLevel: 50,
        unitPrice: 450.00,
        unit: "Piece",
        lastInwardDate: "2026-03-10",
        lastOutwardDate: "2026-04-01",
        batches: [
            { batchNo: "BT-THR-2603", qty: 80, mfgDate: "2026-03-01", expiryDate: "N/A", grnRef: "GRN-00310", storageLocation: "Zone-E / Bin-01" },
            { batchNo: "BT-THR-2601", qty: 70, mfgDate: "2026-01-15", expiryDate: "N/A", grnRef: "GRN-00282", storageLocation: "Zone-E / Bin-02" },
        ]
    },
    {
        id: 9,
        name: "Antiseptic Solution 500ml",
        sku: "MED-ANT-500",
        barcode: "8901234567898",
        category: "Antiseptics",
        brand: "CleanGuard",
        location: "Store B - Rack 6",
        totalQty: 0,
        availableQty: 0,
        reservedQty: 0,
        reorderLevel: 500,
        unitPrice: 120.00,
        unit: "Bottle",
        lastInwardDate: "2026-01-15",
        lastOutwardDate: "2026-03-28",
        batches: []
    },
    {
        id: 10,
        name: "Bandage Roll 10cm x 4m",
        sku: "SUP-BDG-010",
        barcode: "8901234567899",
        category: "Surgical Supplies",
        brand: "MedSafe",
        location: "Store B - Rack 2",
        totalQty: 3200,
        availableQty: 2900,
        reservedQty: 300,
        reorderLevel: 1000,
        unitPrice: 15.00,
        unit: "Roll",
        lastInwardDate: "2026-03-25",
        lastOutwardDate: "2026-04-05",
        batches: [
            { batchNo: "BT-BDG-2603", qty: 2000, mfgDate: "2026-03-15", expiryDate: "2029-03-15", grnRef: "GRN-00316", storageLocation: "Zone-C / Bin-10" },
            { batchNo: "BT-BDG-2602", qty: 1200, mfgDate: "2026-02-01", expiryDate: "2029-02-01", grnRef: "GRN-00292", storageLocation: "Zone-C / Bin-11" },
        ]
    },
];

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
    return <span className={`badge uppercase rounded-full text-[10px] tracking-wide ${s.cls}`}>{s.label}</span>;
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

const Inventory = () => {
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isShow, setIsShow] = useState(false);
    const [isBulkShow, setIsBulkShow] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // In a real app, this would come from an API via react-query
    const inventoryData = INVENTORY_DATA;
    const isLoading = false;

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

        return data;
    }, [inventoryData, debounceSearch, statusFilter, categoryFilter]);

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
                                                    <p className="text-[11px] text-gray-400 font-mono">{item.barcode}</p>
                                                </div>
                                            </div>
                                        ),
                                        sku: (
                                            <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded text-gray-600">{item.sku}</span>
                                        ),
                                        category: (
                                            <span className="text-xs bg-primary/5 text-primary font-semibold px-2 py-1 rounded-full">{item.category}</span>
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

            {/* bulk creation modal */}
            <AddModal
                isShow={isBulkShow}
                setIsShow={setIsBulkShow}
                title="Bulk Creation"
                maxWidth='60'
                placement='start'  // top | start | center | end
            >
                <BulkCreationModal
                    onCancel={() => setIsBulkShow(false)}
                    onImport={(data) => {
                        console.log('Import data:', data);
                        setIsBulkShow(false);
                    }}
                />
            </AddModal>
        </>
    );
};

export default Inventory;


// ─── Sub-components ─────────────────────────────────────────────────────────────

function MiniStat({ label, value, color = "text-gray-800" }) {
    return (
        <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            <p className={`text-base font-bold ${color} mt-0.5`}>{value}</p>
        </div>
    );
}
import React, { useState, useMemo } from "react";
import { FiSearch, FiBox, FiCheck } from "react-icons/fi";
import IconX from "../../../components/Icon/IconX";
import { IoInformationCircleOutline } from "react-icons/io5";
import masterData from "../../../Backend/master.backend";
import { ImSpinner8 } from "react-icons/im";

const DUMMY_PRODUCTS = [
    {
        id: 1,
        name: "Wireless Mouse M185",
        sku: "MS-M185-BLK",
        barcode: "8901034001010",
        unit_type: "Pcs",
        mrp: 699,
        brand: { name: "Logitech" },
        productCategories: [{ name: "Electronics" }, { name: "Accessories" }],
    },
    {
        id: 2,
        name: "Mechanical Keyboard K845",
        sku: "KB-K845-RED",
        barcode: "8901034001027",
        unit_type: "Pcs",
        mrp: 4299,
        brand: { name: "Logitech" },
        productCategories: [{ name: "Electronics" }],
    },
    {
        id: 3,
        name: "Full HD Webcam C920",
        sku: "WC-C920-HD",
        barcode: "8901034001034",
        unit_type: "Pcs",
        mrp: 8500,
        brand: { name: "Logitech" },
        productCategories: [{ name: "Electronics" }, { name: "Video" }],
    },
    {
        id: 4,
        name: "Noise Cancelling Headphones H800",
        sku: "HP-H800-BT",
        barcode: "8901034001041",
        unit_type: "Pcs",
        mrp: 9999,
        brand: { name: "Sony" },
        productCategories: [{ name: "Audio" }],
    },
    {
        id: 5,
        name: "USB-C Multiport Adapter",
        sku: "AD-USBC-6IN1",
        barcode: "8901034001058",
        unit_type: "Pcs",
        mrp: 2499,
        brand: { name: "Belkin" },
        productCategories: [{ name: "Accessories" }],
    }
];

const ProductList = ({
    products,
    onClose,
    data,
    title = "Select Products to Import",
    subtitle = "Choose from the products below to import into your system."
}) => {
    const { mutateAsync, isPending } = masterData.TQCreateMaster();


    // If products is not provided or is empty/null, fall back to dummy list
    const actualProducts = products && products.length > 0 ? products : DUMMY_PRODUCTS;

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return actualProducts;
        return actualProducts.filter(p =>
            p.name?.toLowerCase().includes(query) ||
            p.sku?.toLowerCase().includes(query) ||
            p.barcode?.toLowerCase().includes(query) ||
            p.brand?.name?.toLowerCase().includes(query)
        );
    }, [actualProducts, searchQuery]);

    // Handle single row checkbox change
    const handleToggle = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Handle select all / deselect all for currently filtered products
    const isAllSelected = useMemo(() => {
        if (filteredProducts.length === 0) return false;
        return filteredProducts.every(p => selectedIds.has(p.id));
    }, [filteredProducts, selectedIds]);

    const handleToggleAll = () => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (isAllSelected) {
                // Deselect all filtered products
                filteredProducts.forEach(p => next.delete(p.id));
            } else {
                // Select all filtered products
                filteredProducts.forEach(p => next.add(p.id));
            }
            return next;
        });
    };

    // Trigger onImport with selected product objects
    const handleImportClick = async () => {
        const selectedProducts = actualProducts.filter(p => selectedIds.has(p.id));

        const formData = {
            connectionId: data.id,
            products: selectedProducts,
            parent: data.parent
        }

        const res = await mutateAsync({ path: "/product/import", formData });

        if (res.success) onClose();
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden max-w-2xl mx-auto">
            {/* Header */}
            <div className="p-4 flex items-start justify-between">
                <div className="border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>

                <button
                    type="button"
                    className="text-white-dark hover:text-dark"
                    onClick={onClose}
                >
                    <IconX />
                </button>
            </div>

            {/* Search and Quick Filters */}
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products by name, SKU, barcode..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Selection Status & Select All Checkbox */}
            <div className="px-4 py-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <label className="flex items-center gap-2.5 cursor-pointer font-medium hover:text-gray-700 transition-colors">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                    Select All ({filteredProducts.length} items)
                </label>
                <div>
                    <span className="font-semibold text-primary">{selectedIds.size}</span> selected
                </div>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto max-h-[400px] min-h-[250px] divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
                            <FiBox size={24} />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">No products found</p>
                        <p className="text-xs text-gray-400 mt-1">Try refining your search query or check back later.</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => {
                        const isChecked = selectedIds.has(product.id);
                        return (
                            <div
                                key={product.id}
                                onClick={() => handleToggle(product.id)}
                                className={`flex items-start gap-3 p-4 hover:bg-gray-50/70 transition-colors cursor-pointer select-none ${isChecked ? "bg-primary/5 hover:bg-primary/5" : ""
                                    }`}
                            >
                                {/* Checkbox on the side */}
                                <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggle(product.id)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800 truncate">
                                                {product.name}
                                            </h4>
                                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                SKU: {product.sku} {product.barcode ? `| Barcode: ${product.barcode}` : ""}
                                            </p>
                                        </div>
                                        {product.mrp !== undefined && (
                                            <span className="text-sm font-semibold text-gray-700 shrink-0">
                                                ₹{product.mrp}
                                            </span>
                                        )}
                                    </div>

                                    {/* Meta Tags (Brand, Categories, Unit) */}
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {product.brand?.name && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                                                {product.brand.name}
                                            </span>
                                        )}
                                        {product.unit_type && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">
                                                {product.measure} {product.unit_type} {product.package_type}
                                            </span>
                                        )}
                                        {product.productCategories?.map((cat, idx) => (
                                            <div key={idx} className="flex items-center gap-1">
                                                <span
                                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-600"
                                                >
                                                    {cat.name ?? cat}
                                                </span>
                                                {
                                                    cat?.subcategories?.map((subCat, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-600"
                                                        >
                                                            {subCat.name ?? subCat}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        ))}
                                    </div>
                                    {product.description && (
                                        <span className="mt-2 inline-flex items-center gap-2 py-1.5 px-2 rounded text-[10px] font-medium bg-amber-50 text-amber-600">
                                            <IoInformationCircleOutline size={16} />
                                            <span className="line-clamp-1">{product.description}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer with Import Button */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => setSelectedIds(new Set())}
                    disabled={selectedIds.size === 0}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Clear Selection
                </button>
                <button
                    type="button"
                    onClick={handleImportClick}
                    disabled={selectedIds.size === 0}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${selectedIds.size > 0
                        ? "bg-primary text-white hover:bg-primary-dark cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isPending
                        ? <ImSpinner8 className="animate-spin" size={18} />
                        : <FiCheck size={16} />
                    }
                    Import {selectedIds.size > 0 ? `(${selectedIds.size})` : ""} Products
                </button>
            </div>
        </div>
    );
};

export default ProductList;
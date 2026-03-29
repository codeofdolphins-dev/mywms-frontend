import { currencyFormatter } from "../../utils/currencyFormatter";

const ReleaseOrderPreview = ({ formData, setFormData, onConfirm, setIsShow, rhfSetValue, allFields }) => {
    const { bpo_no, target_store, required_by, priority, instructions, items } = formData;

    // Compute grand_total dynamically from current items
    const grand_total = items?.reduce((acc, item) => {
        const qty = parseFloat(item.release_qty) || 0;
        return acc + qty * item.unit_price;
    }, 0) || 0;

    // Find the original RHF field index by bpo_item_id
    function findOriginalIndex(bpoItemId) {
        return allFields?.findIndex((f) => f.bpo_item_id === bpoItemId);
    }

    function updateItem(id, value) {
        // Update preview state
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.bpo_item_id === id ? { ...item, release_qty: value } : item
            ),
        }));

        // Sync back to main form's RHF
        const originalIndex = findOriginalIndex(id);
        if (originalIndex !== -1) {
            rhfSetValue(`items.${originalIndex}.release_qty`, value);
        }
    }

    function removeItem(id) {
        // Sync back to main form's RHF — clear the release_qty
        const originalIndex = findOriginalIndex(id);
        if (originalIndex !== -1) {
            rhfSetValue(`items.${originalIndex}.release_qty`, null);
        }

        // Remove from preview state
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.bpo_item_id !== id),
        }));
    }

    return (
        <div className="panel space-y-3">
            {/* Order Details */}
            <div className="panel !p-0 overflow-hidden">
                <div className="px-5 pb-3.5 border-b border-[#e0e6ed] dark:border-[#1b2e4b] flex justify-between items-center">
                    <h3 className="font-semibold">
                        Order details
                        <span className="ml-3 font-mono text-xs bg-dark/5 dark:bg-dark/20 px-3 py-1.5 rounded-lg text-white-dark">{bpo_no}</span>
                    </h3>
                    <span className="badge badge-outline-primary rounded-full capitalize">{priority}</span>
                </div>
                <div className="grid grid-cols-2">
                    {[
                        { label: "Target store", value: target_store },
                        { label: "Delivery required by", value: required_by },
                        { label: "Dispatch instructions", value: instructions || "—" },
                        { label: "BPO reference", value: bpo_no, mono: true },
                    ].map((item, i) => (
                        <div key={i} className={`px-5 py-3 border-b border-[#e0e6ed] dark:border-[#1b2e4b] ${i % 2 === 0 ? "border-r" : ""}`}>
                            <p className="text-xs text-white-dark mb-1">{item.label}</p>
                            <p className={`font-semibold text-sm ${item.mono ? "font-mono text-xs" : ""}`}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Items Table */}
            <div className="panel !p-0 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#e0e6ed] dark:border-[#1b2e4b] flex justify-between items-center">
                    <h3 className="font-semibold">Contracted items</h3>
                    <span className="text-xs text-white-dark">{items.length} products</span>
                </div>
                <div className="overflow-x-auto" style={{ maxHeight: "calc(100vh - 500px)" }}>
                    <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
                        <colgroup>
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "18%" }} />
                            <col style={{ width: "27%" }} />
                            <col style={{ width: "15%" }} />
                        </colgroup>
                        <thead className="bg-[#f5f5f5] dark:bg-[#1b2e4b]/40 sticky top-0 z-10">
                            <tr className="text-xs font-semibold text-white-dark uppercase tracking-wide">
                                <th className="px-5 py-3 text-left">Product</th>
                                <th className="px-5 py-3 text-left">Unit price</th>
                                <th className="px-5 py-3 text-left">Remaining qty</th>
                                <th className="px-5 py-3 text-left">Release qty</th>
                                <th className="px-5 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={i} className="border-t border-[#e0e6ed] dark:border-[#1b2e4b] hover:bg-[#f5f5f5] dark:hover:bg-[#1b2e4b]/40 transition-colors">
                                    <td className="px-5 py-3">
                                        <p className="font-semibold text-sm">{item.product.name}</p>
                                        <p className="text-xs font-mono text-white-dark mt-0.5">{item.product.sku}</p>
                                    </td>
                                    <td className="px-5 py-3 text-sm">{currencyFormatter(item.unit_price)}</td>
                                    <td className="px-5 py-3">
                                        <span className="inline-flex items-center gap-1 bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                                            {item.remaining_qty} {item.product.unit_type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="w-20 text-center text-sm font-semibold border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-md px-2 py-1 bg-white dark:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                value={item.release_qty}
                                                onChange={(e) => updateItem(item.bpo_item_id, e.target.value)}
                                            />
                                            <span className="text-xs text-white-dark">{item.product.unit_type}</span>
                                        </div>
                                        <p className="text-xs text-white-dark mt-1">
                                            Line total: <span className="text-gray-800 dark:text-white font-medium">{currencyFormatter(item.release_qty * item.unit_price)}</span>
                                        </p>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button
                                            type="button"
                                            title="Remove item"
                                            className="w-7 h-7 mx-auto flex items-center justify-center rounded-md border border-[#e0e6ed] dark:border-[#1b2e4b] hover:bg-danger/10 hover:border-danger/30 transition-all group"
                                            onClick={() => removeItem(item.bpo_item_id)}
                                        >
                                            <svg
                                                width="13"
                                                height="13"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                className="text-white-dark group-hover:text-danger transition-colors"
                                            >
                                                <line x1="2" y1="2" x2="12" y2="12" />
                                                <line x1="12" y1="2" x2="2" y2="12" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-[#e0e6ed] dark:border-[#1b2e4b] bg-[#f5f5f5] dark:bg-[#1b2e4b]/40">
                            <tr className="p-5">
                                <td
                                    colSpan={3}
                                    className="px-5 py-3 text-right text-xs text-white-dark"
                                >
                                    Release order total (approx)
                                </td>
                                <td
                                    colSpan={2}
                                    className="px-5 py-3 text-right text-base font-bold"
                                >
                                    {currencyFormatter(grand_total)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <p className="text-xs text-white-dark px-5 py-3 border-t border-[#e0e6ed] dark:border-[#1b2e4b] leading-relaxed">
                    By confirming, you are issuing a legally binding release order against {bpo_no}. This action cannot be undone.
                </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsShow(false)} className="btn btn-outline-danger">
                    Cancel
                </button>
                <button type="button" onClick={() => onConfirm(true)} className="btn btn-primary">
                    Confirm release order
                </button>
            </div>
        </div>
    );
};

export default ReleaseOrderPreview;

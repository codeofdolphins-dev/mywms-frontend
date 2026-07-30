import { packSize } from "./packSize";

/**
 * Shared react-select renderer for product options.
 * Product names repeat across sizes — show what actually tells them apart.
 *
 * Pass to RHSelect as `formatOptionLabel={productOptionLabel}`.
 */
export function productOptionLabel(product, { context }) {
    const meta = [packSize(product), product?.sku, product?.barcode].filter(Boolean);

    /** the closed control is narrow — keep the selected value to one line */
    if (context === "value") {
        return (
            <span className="truncate">
                {product?.name}
                {packSize(product) && <span className="text-gray-400 ml-1.5 capitalize">{packSize(product)}</span>}
            </span>
        );
    }

    return (
        <div className="min-w-0">
            <span className="block font-medium truncate">{product?.name}</span>
            {meta.length > 0 && (
                <span className="block text-[10px] text-gray-400 truncate capitalize">{meta.join(" · ")}</span>
            )}
        </div>
    );
}

/**
 * Matching search for the above — searches the identifiers too,
 * not just the (repeating) name.
 *
 * Pass to RHSelect as `filterOption={productOptionFilter}`.
 */
export function productOptionFilter(option, input) {
    if (!input?.trim()) return true;
    const product = option?.data;
    return [product?.name, product?.sku, product?.barcode, packSize(product)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(input.trim().toLowerCase());
}

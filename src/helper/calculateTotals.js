export function calculateTotals(items) {
    return items.reduce(
        (acc, item) => {
            const qty = Number(item.ReqQty) || 0;
            const purchasePrice = Number(item.purchase_price) || 0;
            const mrp = Number(item.MRP) || 0;

            acc.totalPurchasePrice += purchasePrice * qty;
            acc.totalMRP += mrp * qty;

            return acc;
        },
        {
            totalPurchasePrice: 0,
            totalMRP: 0,
        }
    );
};
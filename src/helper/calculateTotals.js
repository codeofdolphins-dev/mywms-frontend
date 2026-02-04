export function calculateTotals(items) {
    return items.reduce((total, item) => {
        const qty = Number(item.reqQty) || 0;
        const priceLimit = Number(item.priceLimit) || 0;

        return total + priceLimit * qty;
    }, 0);
}

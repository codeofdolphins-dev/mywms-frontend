import { useQuery } from "@tanstack/react-query";
import API from ".";

class PurchaseOrder {
    TQPurchaseOrderList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["purchaseOrderList", params],
            queryFn: async () => {
                const res = await API.get("/purchase-order/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

const purchaseOrder = new PurchaseOrder();
export default purchaseOrder;
import { useQuery } from "@tanstack/react-query";
import API from ".";

class Order {
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

    TQPurchaseOrderItemDetails(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["purchaseOrderItemDetails", params],
            queryFn: async () => {
                const res = await API.get("/purchase-order/item-details", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQSalesOrderList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["salesOrderList", params],
            queryFn: async () => {
                const res = await API.get("/sales-order/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

export const order = new Order();
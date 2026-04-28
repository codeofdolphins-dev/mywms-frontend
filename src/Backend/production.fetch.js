import { useQuery } from "@tanstack/react-query";
import API from ".";

class Production {
    TQTransferOrderList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["transferOrderList", params],
            queryFn: async () => {
                const res = await API.get("/transfer-order/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
    TQTransferOrderItem(to_no = "", isEnabled = true) {
        return useQuery({
            queryKey: ["transferOrderItem", to_no],
            queryFn: async () => {
                const res = await API.get(`/transfer-order/${to_no}`);
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQProductionOrderList(params = "", isEnabled = true) {
        return useQuery({
            queryKey: ["productionOrderList", params],
            queryFn: async () => {
                const res = await API.get(`/production-order/list`, { params });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQProductionOrderItem(pro_no = "", isEnabled = true) {
        return useQuery({
            queryKey: ["productionOrderItem", pro_no],
            queryFn: async () => {
                const res = await API.get(`/production-order/${pro_no}`);
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQProductionReceiptList(params = "", isEnabled = true) {
        return useQuery({
            queryKey: ["productionReceiptList", params],
            queryFn: async () => {
                const res = await API.get(`/production-receipt/list`, {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQProductionReceiptItem(pr_no = "", isEnabled = true) {
        return useQuery({
            queryKey: ["productionReceiptItem", pr_no],
            queryFn: async () => {
                const res = await API.get(`/production-receipt/${pr_no}`);
                return res.data;
            },
            enabled: isEnabled,
        });
    };

}

export const production = new Production();
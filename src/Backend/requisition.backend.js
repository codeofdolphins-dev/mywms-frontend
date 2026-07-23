import { useQuery } from "@tanstack/react-query";
import API from ".";

class Requisition {
    TQRequisitionCategoryList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["requisitionCategoryList", params],
            queryFn: async () => {
                const res = await API.get("/requisition-category/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQTradingRequisitionList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["tradingRequisitionList", params],
            queryFn: async () => {
                const res = await API.get("/requisition/trading/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQTradingReceiveRequisitionList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["tradingReceiveRequisitionList", params],
            queryFn: async () => {
                const res = await API.get("/requisition/trading/receive-list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQTradingRequisitionDetails(id, isEnabled = true) {
        return useQuery({
            queryKey: ["tradingRequisitionDetails", id],
            queryFn: async () => {
                const res = await API.get(`/requisition/trading/${id}`);
                return res.data;
            },
            enabled: isEnabled && Boolean(id),
        });
    };
}

const requisition = new Requisition();
export default requisition;
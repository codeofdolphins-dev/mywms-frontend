import { useQuery } from "@tanstack/react-query";
import API from ".";

class Quotation {
    TQReceiveQuotationList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["receiveQuotationList", params],
            queryFn: async () => {
                const res = await API.get("/quotation/receive-list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    /** QUOTATION */
    TQQuotationList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["quotationList", params],
            queryFn: async () => {
                const res = await API.get("/quotation/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

export const quotation = new Quotation();
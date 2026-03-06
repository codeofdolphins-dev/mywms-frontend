import { useQuery } from "@tanstack/react-query";
import API from ".";

class RFQ_Quotation {
    /** QUOTATION */
    TQRfqQuotationList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["rfqQuotationList", params],
            queryFn: async () => {
                const res = await API.get("/rfq/quotation/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
    TQRfqQuotationReceiveList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["rfqQuotationReceiveList", params],
            queryFn: async () => {
                const res = await API.get("/rfq/quotation-receive/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

export const rfqQuotation = new RFQ_Quotation();
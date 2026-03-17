import { useQuery } from "@tanstack/react-query";
import API from ".";

class BPO {
    TQBlanketOrderList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["blanketOrderList", params],
            queryFn: async () => {
                const res = await API.get("/rfq/blanket-order/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQBlanketOrderItem(bpo_no, isEnabled = true) {
        return useQuery({
            queryKey: ["blanketOrderItem", bpo_no],
            queryFn: async () => {
                const res = await API.get(`/rfq/blanket-order/${bpo_no}`);
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

export const bpo = new BPO();
export default bpo;
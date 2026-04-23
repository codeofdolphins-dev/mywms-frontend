import { useQuery } from "@tanstack/react-query";
import API from ".";

class TransferOrder {
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
}

export const transferOrder = new TransferOrder();
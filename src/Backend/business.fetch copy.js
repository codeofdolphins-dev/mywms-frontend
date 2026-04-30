import { useQuery } from "@tanstack/react-query";
import API from ".";

class Inventory {
    TQInventoryList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["inventoryList", params],
            queryFn: async () => {
                const res = await API.get("/inventory/list", { params });
                return res.data;
            },
            enabled: isEnabled
        });
    };
}

const inventory = new Inventory();
export default inventory;
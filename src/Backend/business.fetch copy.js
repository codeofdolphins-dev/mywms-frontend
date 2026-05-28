import { useQuery } from "@tanstack/react-query";
import API from ".";

class Inventory {
    TQInventoryScopeList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["inventoryScopeList", params],
            queryFn: async () => {
                const res = await API.get("/inventory/scope_list", { params });
                return res.data;
            },
            enabled: isEnabled
        });
    };
    TQInventoryFullList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["inventoryFullList", params],
            queryFn: async () => {
                const res = await API.get("/inventory/full_list", { params });
                return res.data;
            },
            enabled: isEnabled
        });
    };
}

const inventory = new Inventory();
export default inventory;
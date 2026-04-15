import { useQuery } from "@tanstack/react-query";
import API from ".";

class Business {
    TQTenantBusinessNodeList() {
        return useQuery({
            queryKey: ["tenantBusinessNodeList"],
            queryFn: async () => {
                const res = await API.get("/business/node-list");
                return res.data;
            },
            gcTime: Infinity,
        });
    };

    TQTenantRegisteredNodeList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["tenantRegisteredNodeList", params],
            queryFn: async () => {
                const res = await API.get("/business/registered-node-list", { params });
                return res.data;
            },
            enabled: isEnabled
        });
    };

    TQManufacturingNodeList() {
        return useQuery({
            queryKey: ["tenantManufacturingNodeList"],
            queryFn: async () => {
                const res = await API.get("/business/manufacturing-node-list");
                return res.data;
            },
        });
    };
}

const business = new Business();
export default business;
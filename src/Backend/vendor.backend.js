import { useQuery } from "@tanstack/react-query";
import API from ".";

class Vendor {
    TQVendorList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["vendorList", params],
            queryFn: async () => {
                const res = await API.get("/vendor/list", {
                    params
                })
                return res.data;
            },
            enabled: isEnabled,
        })
    }
    TQVendorCategoryList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["vendorCategoryList", params],
            queryFn: async () => {
                const res = await API.get("/vendor/category/list", {
                    params
                })
                return res.data;
            },
            enabled: isEnabled,
        })
    }
}

const vendor = new Vendor();
export default vendor;
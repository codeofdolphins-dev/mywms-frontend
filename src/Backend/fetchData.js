import { useQuery } from "@tanstack/react-query";
import API from ".";

class FetchData {
    TQAllCategoryList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["category-all-list", params],
            queryFn: async () => {
                const res = await API.get("/category/all-list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.log("error", error);
            },
            select: (data) => data.data
        });
    };

    TQStateList() {
        return useQuery({
            queryKey: ["state-list"],
            queryFn: async () => {
                const res = await API.get("/location/state");
                return res.data;
            },
            gcTime: Infinity,
            staleTime: Infinity,
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.log("error", error);
            },
            select: (data) => data.data
        });
    };

    TQDistrictList(s_id) {
        return useQuery({
            queryKey: ["district-list", s_id],
            queryFn: async () => {
                const res = await API.get("/location/district", {
                    params: {
                        s_id
                    }
                });
                return res.data;
            },
            enabled: !!s_id,
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.log("error", error);
            },
            select: (data) => data.data
        });
    };

    TQAllSupplierList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["supplier-all-list", params],
            queryFn: async () => {
                const res = await API.get("/supplier/all", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQAllBrandList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["brandList", params],
            queryFn: async () => {
                const res = await API.get("/brand/all", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled
        });
    };

    TQAllHsnList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["hsnList", params],
            queryFn: async () => {
                const res = await API.get("/hsn/all-list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQWarehouseTypes() {
        return useQuery({
            queryKey: ["warehouseTypes"],
            queryFn: async () => {
                const res = await API.get("/warehouse/types");
                return res.data.data;
            },
        });
    };

    TQWarehouseTypes() {
        return useQuery({
            queryKey: ["warehouseTypeList"],
            queryFn: async () => {
                const res = await API.get("/warehouse/types");
                return res.data.data;
            },
        });
    };

    TQProductList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["productList", params],
            queryFn: async () => {
                const res = await API.get("/product/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled
        });
    };
    
    TQPermissionList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["permissionList", params],
            queryFn: async () => {
                const res = await API.get("/permission/all-permission", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled
        });
    };
}

const fetchData = new FetchData;
export default fetchData;
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
            queryKey: ["stateList"],
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
            queryKey: ["districtList", s_id],
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
            queryKey: ["supplierList", params],
            queryFn: async () => {
                const res = await API.get("/supplier/list", {
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

    TQUnitTypeList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["unitTypeList", params],
            queryFn: async () => {
                const res = await API.get("/unit/all", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQPackageTypeList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["packageTypeList", params],
            queryFn: async () => {
                const res = await API.get("/package-type/all", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

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

    TQTenantRegisteredNodeList() {
        return useQuery({
            queryKey: ["tenantRegisteredNodeList"],
            queryFn: async () => {
                const res = await API.get("/business/registered-node-list");
                return res.data;
            },
        });
    };

    TQAllUserList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["allUserList", params],
            queryFn: async () => {
                const res = await API.get("/user/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQAllowNodeList(isEnabled = true) {
        return useQuery({
            queryKey: ["AllowNodeList"],
            queryFn: async () => {
                const res = await API.get("/requisition/allow-node");
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQRequisitionList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["requisitionList", params],
            queryFn: async () => {
                const res = await API.get("/requisition/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };

    TQReceiveRequisitionList(isEnabled = true) {
        return useQuery({
            queryKey: ["receiveRequisitionList"],
            queryFn: async () => {
                const res = await API.get("/requisition/receive-list");
                return res.data;
            },
            enabled: isEnabled,
        });
    };


    TQRfqList(isEnabled = true) {
        return useQuery({
            queryKey: ["rfqList"],
            queryFn: async () => {
                const res = await API.get("/rfq/list");
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

const fetchData = new FetchData;
export default fetchData;
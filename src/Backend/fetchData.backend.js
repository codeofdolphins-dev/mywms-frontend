import { useQuery } from "@tanstack/react-query";
import API from ".";
import { errorToastAlert } from "../utils/alerts";

class FetchData {
    TQAllCategoryList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["category-all-list", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/category/all-list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
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

    TQStateList(isEnabled = true) {
        return useQuery({
            queryKey: ["stateList"],
            queryFn: async () => {
                const res = await API.get("/location/state");
                return res.data;
            },
            gcTime: Infinity,
            staleTime: Infinity,
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
                try {
                    const res = await API.get("/supplier/list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQAllBrandList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["brandList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/brand/all", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled
        });
    };

    TQAllHsnList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["hsnList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/hsn/all-list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQProductList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["productList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/product/list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled
        });
    };

    TQTenantProductList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["tenantProductList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/product/tenant-list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled
        });
    };


    TQPermissionList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["permissionList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/permission/all-permission", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled
        });
    };

    TQUnitTypeList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["unitTypeList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/unit/all", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQPackageTypeList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["packageTypeList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/package-type/all", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };



    TQAllUserList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["allUserList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/user/list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQAllowNodeList(isEnabled = true) {
        return useQuery({
            queryKey: ["AllowNodeList"],
            queryFn: async () => {
                try {
                    const res = await API.get("/requisition/allow-node");
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQRequisitionList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["requisitionList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/requisition/list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQReceiveRequisitionList(isEnabled = true) {
        return useQuery({
            queryKey: ["receiveRequisitionList"],
            queryFn: async () => {
                try {
                    const res = await API.get("/requisition/receive-list");
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQRfqList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["rfqList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/rfq/list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQAppliedRfqList(isEnabled = true) {
        return useQuery({
            queryKey: ["appliedRfqList"],
            queryFn: async () => {
                try {
                    const res = await API.get("/rfq/applied-rfq-list");
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };


    TQStoreList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["storeList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/store/list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQStoreCount(isEnabled = true) {
        return useQuery({
            queryKey: ["storeCount"],
            queryFn: async () => {
                try {
                    const res = await API.get("/store/count-by-type");
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };


    TQOutwardList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["outwardList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/outward/list", {
                        params
                    });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQOutwardDetails(out_no, isEnabled = true) {
        return useQuery({
            queryKey: ["outwardDetails", out_no],
            queryFn: async () => {
                try {
                    const res = await API.get(`/outward/${out_no}`);
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };



    TQBatchListByProduct(product_id, isEnabled = true) {
        return useQuery({
            queryKey: ["batchListByProduct", product_id],
            queryFn: async () => {
                try {
                    const res = await API.get(`/batch/get-by-product/${product_id}`);
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQDirectTransferList(params, isEnabled = true) {
        return useQuery({
            queryKey: ["directTransferList", params],
            queryFn: async () => {
                try {
                    const res = await API.get(`/direct-transfer/list`, { params });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQDirectTransferContextList(params, isEnabled = true) {
        return useQuery({
            queryKey: ["directTransferContextList", params],
            queryFn: async () => {
                try {
                    const res = await API.get(`/direct-transfer/list/context`, { params });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQConnectionList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["connectionList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/connection/list", { params });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };

    TQBrowseCompanies(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["browseCompanies", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/connection/browse", { params });
                    return res.data;
                } catch (error) {
                    if (error.response?.data?.code === 403) {
                        errorToastAlert(error.response?.data?.message)
                    }
                    throw error;
                }
            },
            enabled: isEnabled,
        });
    };
}

const fetchData = new FetchData;
export default fetchData;
import { useQuery } from "@tanstack/react-query";
import API from ".";
import { errorAlert } from "../utils/alerts";


class SuperAdmin {
    TQBusinessNode(isEnabled = true) {
        return useQuery({
            queryKey: ["businessNodes"],
            queryFn: async () => {
                const res = await API.get("/super-admin/business-nodes")
                return res.data;
            },
            enabled: isEnabled,
        })
    }

    TQTenantBusinessFlow(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["tenantBusinessFlow", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/super-admin/tenant-business-flow", {
                        params
                    })
                    return res.data;
                } catch (error) {
                    const msg = error.response?.data?.message || "Internal server error!!!";
                    errorAlert(msg);
                }
            },
            enabled: isEnabled
        })
    }

    TQCompanyList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["companyList", params],
            queryFn: async () => {
                const res = await API.get("/super-admin/company-list", {
                    params
                })
                return res.data;
            },
            enabled: isEnabled,
        })
    }
}

const superAdmin = new SuperAdmin();
export default superAdmin;
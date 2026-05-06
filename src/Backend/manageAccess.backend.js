import { useQuery, useMutation } from "@tanstack/react-query";
import API from ".";
import { errorToastAlert } from "../utils/alerts";


class ManageAccess {
    TQAllRole(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["allRole", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/role/all-role", { params });
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

    TQRolePermission(role_id, isEnabled = true) {
        return useQuery({
            queryKey: ["rolePermission", role_id],
            queryFn: async () => {
                try {
                    const res = await API.get(`/manage-permission/${role_id}`);
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

const manageAccess = new ManageAccess();
export default manageAccess;
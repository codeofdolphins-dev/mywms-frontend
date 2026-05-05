import { useQuery, useMutation } from "@tanstack/react-query";
import API from ".";


class ManageAccess {
    TQAllRole(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["allRole", params],
            queryFn: async () => {
                const res = await API.get("/role/all-role", { params });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
    
    TQRolePermission(role_id, isEnabled = true) {
        return useQuery({
            queryKey: ["rolePermission", role_id],
            queryFn: async () => {
                const res = await API.get(`/manage-permission/${role_id}`);
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

const manageAccess = new ManageAccess();
export default manageAccess;
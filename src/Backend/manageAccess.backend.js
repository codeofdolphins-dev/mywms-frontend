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
}

const manageAccess = new ManageAccess();
export default manageAccess;
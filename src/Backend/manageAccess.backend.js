import { useQuery } from "@tanstack/react-query";
import API from ".";


class ManageAccess {
    TQAllRole(isEnabled = true) {
        return useQuery({
            queryKey: ["allRole"],
            queryFn: async () => {
                const res = await API.get("/role/all-role");
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

const manageAccess = new ManageAccess();
export default manageAccess;
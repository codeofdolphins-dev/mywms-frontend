import { useQuery } from "@tanstack/react-query";
import API from ".";

class BusinessNode {
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
}

const businessNode = new BusinessNode();
export default businessNode;
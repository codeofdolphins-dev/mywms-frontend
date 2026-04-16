import { useQuery } from "@tanstack/react-query";
import API from ".";

class Inward {
    TQInwardList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["inwardList", params],
            queryFn: async () => {
                const res = await API.get("/inward/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

const inward = new Inward();
export default inward;
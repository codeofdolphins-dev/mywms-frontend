import { useQuery } from "@tanstack/react-query";
import API from ".";

class BomFetch {
    TQBOMList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["bomList", params],
            queryFn: async () => {
                const res = await API.get("/bom/list", { params });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

const bomFetch = new BomFetch();
export default bomFetch;

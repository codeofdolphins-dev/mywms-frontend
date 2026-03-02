import { useQuery } from "@tanstack/react-query";
import API from ".";

class Requisition {
    TQRequisitionCategoryList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["requisitionCategoryList", params],
            queryFn: async () => {
                const res = await API.get("/requisition-category/list", {
                    params
                });
                return res.data;
            },
            enabled: isEnabled,
        });
    };
}

const requisition = new Requisition();
export default requisition;
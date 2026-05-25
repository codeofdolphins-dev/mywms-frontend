import { useQuery } from "@tanstack/react-query";
import API from ".";
import { errorToastAlert } from "../utils/alerts";

class CostFetch {
    TQCostHeadList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["costHeadList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/cost-head/list", {
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

    TQCostCenterList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["costCenterList", params],
            queryFn: async () => {
                try {
                    const res = await API.get("/cost-center/list", {
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
            select: (data) => data
        });
    };
}

const costFetch = new CostFetch;
export default costFetch;
import { useQuery } from "@tanstack/react-query";
import API from ".";

class FetchData {
    TQAllCategoryList(params = {}, isEnabled = true) {
        return useQuery({
            queryKey: ["category-all-list", params ],
            queryFn: async () => {
                const res = await API.get("/category/all-list", {
                    params
                });
                return res.data;
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
}

const fetchData = new FetchData;
export default fetchData;
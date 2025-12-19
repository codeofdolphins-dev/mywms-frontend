import { useQuery } from "@tanstack/react-query";
import API from ".";

class FetchData {
    TQAllCategoryList() {
        return useQuery({
            queryKey: ["category-all-list" ],
            queryFn: async () => {
                const res = await API.get("/category/all-list", {
                    params: {
                        noLimit: true,
                    }
                });
                return res.data;
            },
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorAlert, successAlert } from "../utils/alerts";
import API from ".";

class Master {
    TQCreateMaster() {
        const QueryClient = useQueryClient()
        return useMutation({
            mutationFn: async (data) => {
                const res = await API.post(data.path, data.data);
                return res.data
            },
            onSuccess: (res) => {
                successAlert(res.message);
                if(res.success){
                    QueryClient.invalidateQueries(["category-all-list"])
                }

            },
            onError: (error) => {
                errorAlert(error.response.data?.message);
            }
        })
    }
}

const master = new Master();
export default master;
import { useMutation } from "@tanstack/react-query";
import { errorAlert, successAlert } from "../utils/alerts";
import API from ".";

class Master {
    TQCreateMaster() {
        return useMutation({
            mutationFn: async (data) => {
                const res = await API.post(data.path, data.data);
                return res.data
            },
            onSuccess: (data) => {
                successAlert(data.message);
            },
            onError: (error) => {                
                errorAlert(error.response.data?.message);
            }
        })
    }
}

const master = new Master();
export default master;
import { useMutation } from "@tanstack/react-query";
import { errorAlert, successAlert } from "../utils/alerts";
import API from ".";

class MasterData {

    TQCategoryCreate() {
        return useMutation({
            mutationFn: async (data) => {
                const res = await API.post("/category/create", data);
                return res.data;
            },
            onSuccess: (data) => {
                console.log(data);
                // successAlert(data?.message);
            },
            onError: (error) => {
                console.log(error.response.data);
                // errorAlert(error.response.data?.message);
            },
        });
    }

}
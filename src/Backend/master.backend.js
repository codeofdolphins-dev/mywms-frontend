import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorAlert, successAlert } from "../utils/alerts";
import API from ".";

class MasterData {
    TQCreateMaster(key = []) {
        const QueryClient = useQueryClient()
        return useMutation({
            mutationFn: async ({ path, formData }) => {
                const res = await API.post(path, formData);
                return res.data
            },
            onSuccess: (res) => {
                successAlert(res.message);
                if (key.length < 1) return;
                if (res.success) QueryClient.invalidateQueries(key);
            },
            onError: (error) => {
                errorAlert(error.response.data?.message);
            }
        })
    }

    TQUpdateMaster(key = []) {
        const QueryClient = useQueryClient()
        return useMutation({
            mutationFn: async ({ path, formData }) => {
                const res = await API.put(path, formData);
                return res.data
            },
            onSuccess: (res) => {
                successAlert(res.message);
                if (key.length < 1) return;
                if (res.success) QueryClient.invalidateQueries(key);
            },
            onError: (error) => {
                errorAlert(error.response.data?.message);
            }
        })
    }

    TQDeleteMaster(key = []) {
        const QueryClient = useQueryClient()
        return useMutation({
            mutationFn: async ({ path }) => {
                const res = await API.delete(path);
                return res.data
            },
            onSuccess: (res) => {
                successAlert(res.message);
                if (key.length < 1) return;
                if (res.success) QueryClient.invalidateQueries(key);

            },
            onError: (error) => {
                errorAlert(error.response.data?.message);
            }
        })
    }
}

const masterData = new MasterData();
export default masterData;
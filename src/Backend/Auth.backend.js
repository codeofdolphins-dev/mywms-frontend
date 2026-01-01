import { useMutation, useQuery } from "@tanstack/react-query";
import API from "./index";
import { errorAlert, successAlert } from "../utils/alerts";
import { useDispatch } from "react-redux";
import { storeLogin } from "../store/AuthSlice";
import secureLocalStorage from "react-secure-storage"

class AuthService {
    TQLogin() {
        return useMutation({
            mutationFn: async (data) => {
                const res = await API.post("/auth/login", data);
                return res.data;
            },
            onSuccess: (data) => {
                successAlert("Login Successfull");
                secureLocalStorage.setItem("tenant", data.tenant);
                secureLocalStorage.setItem("token", data.token)

            },
            onError: (error) => {
                console.log(error.response.data);
                errorAlert(error.response.data?.message || "something Wrong!!!");
            },
        });
    };

    TQLogout() {
        return useMutation({
            mutationFn: async () => {
                const res = await API.get("/auth/logout");
                return res.data;
            },
            onSuccess: (data) => {
                successAlert(data.message)
                secureLocalStorage.clear();
            },
            onError: (err) => {
                errorAlert(err.response.data?.message || "something Wrong while logging out!!!");``
            }
        })
    };

    TQCompanyRegister() {
        return useMutation({
            mutationFn: async (formData) => {
                const res = await API.post("/auth/register-company", formData);
                return res.data;
            },
            onSuccess: () => { },
            onError: () => { },
        });
    };

    TQUserRegister() {
        return useMutation({
            mutationFn: async (formData) => {
                const res = await API.post("/auth/register-user", formData);
                return res.data;
            },
            onSuccess: () => { },
            onError: () => { },
        });
    };

    TQCurrentUser(isEnable) {
        return useQuery({
            queryKey: ["current-user"],
            queryFn: async () => {
                const res = await API.get("/user/current-user");
                return res.data;
            },
            staleTime: Infinity,
            gcTime: Infinity,
            enabled: isEnable,
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.log("error", error);
            },
        });
    };

}


const authService = new AuthService();
export default authService;
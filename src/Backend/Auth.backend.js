import { useMutation } from "@tanstack/react-query";
import API from "./index";


function TQLogin() {
    return useMutation({
        mutationFn: async (data) => {
            const res = await API.post("/auth/logi", data);
            return res.data;
        }, 
        onSuccess: (data) => {
            console.log(data);            
        },
        onError: (error) => {
            console.log(error.response.data);            
        },
    });
};

function TQCompanyRegister() {
    return useMutation({
        mutationFn: async ( formData ) => {
            const res = await API.post("/auth/register-company", formData);
            return res.data;
        }, 
        onSuccess: () => {},
        onError: () => {},
    });
};

function TQUserRegister() {
    return useMutation({
        mutationFn: async ( formData ) => {
            const res = await API.post("/auth/register-user", formData);
            return res.data;
        }, 
        onSuccess: () => {},
        onError: () => {},
    });
};

// function UserRegister() {
//     return useMutation({
//         mutationFn: async ( formData ) => {
//             const res = await API.post("/auth/register-user", formData);
//             return res;
//         }, 
//         onSuccess: () => {},
//         onError: () => {},
//     });
// };

export { TQLogin, TQCompanyRegister, TQUserRegister }
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';


const API = axios.create({
    baseURL: String(import.meta.env.VITE_SERVER_URL),
});

// Add a request interceptor
API.interceptors.request.use(
    (config) => {
        const token = secureLocalStorage.getItem("token");
        const tenant = secureLocalStorage.getItem("tenant");

        if (token) config.headers.Authorization = `Bearer ${token}`;
        if (tenant) config.headers["x-tenant-id"] = tenant;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
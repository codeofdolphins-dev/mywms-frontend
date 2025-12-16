import axios from 'axios';


const API = axios.create({
    baseURL: String(import.meta.env.VITE_SERVER_URL),
    headers: { "Content-Type": "application/json" }
});

export default API;
import axios from "axios";
import store from "../store/store";
import { logoutUser } from "../redux/userSlice";

const serverMode = import.meta.env.VITE_API_URL;

export const API = axios.create({
    baseURL: serverMode,
});

API.interceptors.request.use(
    async (config) => {
        config.withCredentials = true;
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";
        const csrfToken = getCookie("XSRF-TOKEN");
        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
        return config;
    },
    (error) => {
        console.error(error);
        return Promise.reject(error);
    }
);

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop();
        if (cookieValue) {
            return cookieValue.split(";").shift();
        }
    }
}

API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error("Hiba történt:", error);
        const status = error.response?.status;

        if (status === 401) {
            await store.dispatch(logoutUser());
        }

        return Promise.reject(error.response.data);
    }
);

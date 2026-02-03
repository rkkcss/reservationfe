// utils/API.ts
import axios from "axios";
import store from "../store/store";
import { logoutUser } from "../redux/userSlice";
import i18n from "../i18n";
import { notificationManager } from "./notificationConfig";

const serverMode = import.meta.env.VITE_API_URL;

export const API = axios.create({
    baseURL: serverMode,
});

// ===== REQUEST INTERCEPTOR =====
API.interceptors.request.use(
    async (config) => {
        config.withCredentials = true;
        config.headers["Accept"] = "application/json";

        const isFormData = config.data instanceof FormData;
        if (!isFormData) {
            config.headers["Content-Type"] = "application/json";
        }

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

let logoutTimer: number | null = null;

// ===== RESPONSE INTERCEPTOR =====
API.interceptors.response.use(
    (response) => {
        const config = response.config;
        const method = config.method?.toUpperCase();

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '')) {
            if (config.showSuccessNotification !== false) {
                const defaultMessages: Record<string, string> = {
                    'POST': i18n.t('server-response:success.created'),
                    'PUT': i18n.t('server-response:success.updated'),
                    'PATCH': i18n.t('server-response:success.updated'),
                    'DELETE': i18n.t('server-response:success.deleted')
                };

                // Custom success message or default
                const message = config.successMessage || (method ? defaultMessages[method] : undefined) || i18n.t('success.default');

                notificationManager.success(`success-${method}-${Date.now()}`, {
                    message: message,
                    duration: 3
                });
            }
        }

        return response;
    },
    async (error) => {
        console.error("Hiba történt:", error);
        const status = error.response?.status;
        const messageKey = error.response?.data?.message;

        // 401 - Unauthorized
        if (status === 401) {
            notificationManager.warning('unauthorized', {
                message: i18n.t('session.expired'),
                description: i18n.t('session.expired.description'),
                duration: 3
            });

            if (!logoutTimer) {
                logoutTimer = window.setTimeout(async () => {
                    await store.dispatch(logoutUser());
                    logoutTimer = null;
                }, 2000);
            }

            return Promise.reject(error.response?.data || error);
        }

        // 403 - Forbidden
        if (status === 403) {
            notificationManager.error('forbidden', {
                message: messageKey ? i18n.t(messageKey) : i18n.t('error.forbidden'),
                description: i18n.t('error.forbidden.description'),
                duration: 4
            });

            return Promise.reject(error.response?.data || error);
        }

        // 404 - Not Found
        if (status === 404) {
            if (error.config?.showNotFoundNotification) {
                notificationManager.error('not-found', {
                    message: messageKey ? i18n.t(messageKey) : i18n.t('error.not.found'),
                    duration: 3
                });
            }

            return Promise.reject(error.response?.data || error);
        }

        // 500+ - Server Error
        if (status >= 500) {
            notificationManager.error('server-error', {
                message: i18n.t('error.server'),
                description: messageKey ? i18n.t(messageKey) : i18n.t('error.server.description'),
                duration: 4
            });

            return Promise.reject(error.response?.data || error);
        }

        // Network Error
        if (!error.response) {
            notificationManager.error('network-error', {
                message: i18n.t('error.network'),
                description: i18n.t('error.network.description'),
                duration: 4
            });

            return Promise.reject(error);
        }

        // Any another error
        if (messageKey) {
            notificationManager.error(`error-${status}`, {
                message: i18n.t(messageKey),
                duration: 4
            });
        } else {
            notificationManager.error('unknown-error', {
                message: i18n.t('error.unknown'),
                duration: 4
            });
        }

        return Promise.reject(error.response?.data || error);
    }
);

// ===== TYPESCRIPT AUGMENTATION =====
declare module 'axios' {
    export interface AxiosRequestConfig {
        showSuccessNotification?: boolean;
        successMessage?: string;
        customSuccessNotification?: boolean;
        showNotFoundNotification?: boolean;
    }
}

export default API;
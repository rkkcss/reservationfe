// utils/API.ts
import axios from "axios";
import store from "../store/store";
import { logoutUser } from "../redux/userSlice";
import i18n from "../i18n";
import { notificationManager } from "./notificationConfig";

const getBaseUrl = (): string => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol; // "http:" vagy "https:"
    const port = window.location.port; // "5173" dev-ben, "" prod-ban

    // sima localhost fejlesztéshez
    if (hostname === "localhost") {
        return `http://localhost:8080`;
    }

    // subdomain VAGY production domain
    // dev:  pizzeria-bella.localhost → http://pizzeria-bella.localhost:8080
    // prod: pizzeria-bella.booklyapp.me → https://pizzeria-bella.booklyapp.me (same port)
    if (port === "5173") {
        // Vite dev server → Spring Boot 8080-on van
        return `http://${hostname}:8080`;
    }

    // production: React és Spring Boot ugyanazon a domainen fut
    return `${protocol}//${hostname}`;
};

const serverMode = getBaseUrl();

export const API = axios.create({
    baseURL: serverMode,
});

// ===== I18N NAMESPACE =====
const NS = "server-response";
const t = (key: string) => i18n.t(`${NS}:${key}`);

// ===== REQUEST INTERCEPTOR =====
API.interceptors.request.use(async (config) => {
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

    // active business header
    const state = store.getState();
    const activeBusinessEmployee = state.userStore?.selectedBusinessEmployee;
    if (activeBusinessEmployee?.business?.id) {
        config.headers["X-Business-ID"] = activeBusinessEmployee.business.id;
    }

    return config;
});

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

        if (config.customSuccessNotification) {
            return response;
        }

        if (["POST", "PUT", "PATCH", "DELETE"].includes(method || "")) {
            if (config.showSuccessNotification !== false) {
                const defaultMessages: Record<string, string> = {
                    POST: t("success.created"),
                    PUT: t("success.updated"),
                    PATCH: t("success.updated"),
                    DELETE: t("success.deleted"),
                };

                // Egyedi vagy alapértelmezett üzenet
                const message =
                    config.successMessage ||
                    (method ? defaultMessages[method] : undefined) ||
                    t("success.default");

                notificationManager.success(`success-${method}-${Date.now()}`, {
                    title: message,
                    duration: 3,
                });
            }
        }

        return response;
    },
    async (error) => {
        console.error("Hiba történt:", error);
        if (!error.response) {
            notificationManager.error("network-error", {
                title: t("error.network"),
                description: t("error.network.description"),
                duration: 4,
            });

            return Promise.reject(error);
        }

        const status = error.response.status;
        const messageKey = error.response.data?.message;
        const resolveMessage = (fallbackKey: string) =>
            messageKey ? t(messageKey) : t(fallbackKey);

        // 401 - Unauthorized
        if (status === 401) {
            notificationManager.warning("unauthorized", {
                title: t("session.expired"),
                description: t("session.expired.description"),
                duration: 3,
            });

            if (!logoutTimer) {
                logoutTimer = window.setTimeout(async () => {
                    await store.dispatch(logoutUser());
                    logoutTimer = null;
                }, 2000);
            }

            return Promise.reject(error.response.data || error);
        }

        // 403 - Forbidden
        if (status === 403) {
            notificationManager.error("forbidden", {
                title: resolveMessage("error.forbidden"),
                description: t("error.forbidden.description"),
                duration: 4,
            });

            return Promise.reject(error.response.data || error);
        }

        // 404 - Not Found
        if (status === 404) {
            if (error.config?.showNotFoundNotification) {
                notificationManager.error("not-found", {
                    title: resolveMessage("error.not.found"),
                    duration: 3,
                });
            }

            return Promise.reject(error.response.data || error);
        }

        // 500+ - Server Error
        if (status >= 500) {
            notificationManager.error("server-error", {
                title: t("error.server"),
                description: resolveMessage("error.server.description"),
                duration: 4,
            });

            return Promise.reject(error.response.data || error);
        }

        // any other issue
        notificationManager.error(`error-${status}`, {
            title: resolveMessage("error.unknown"),
            duration: 4,
        });

        return Promise.reject(error.response.data || error);
    },
);

// ===== TYPESCRIPT AUGMENTATION =====
declare module "axios" {
    export interface AxiosRequestConfig {
        showSuccessNotification?: boolean;
        successMessage?: string;
        customSuccessNotification?: boolean;
        showNotFoundNotification?: boolean;
    }
}

export default API;

// utils/notificationConfig.ts
import { notification } from "antd";
import { ArgsProps } from "antd/es/notification";
import type { ReactNode } from "react";

// Globális konfiguráció - egyszer hívjuk meg, App.tsx-ben: setupNotifications()
export const setupNotifications = () => {
    notification.config({
        placement: "bottom",
        bottom: 80,
        duration: 4,
        maxCount: 1,
        rtl: false,
    });
};

type NotificationConfig = Omit<ArgsProps, "key" | "type" | "message"> & {
    title: ReactNode;
};

// Notification manager - egyszerre csak egy notification él (maxCount: 1 logikának megfelelően)
class NotificationManager {
    private currentKey: string | null = null;

    private show(
        type: "error" | "warning" | "success" | "info",
        key: string,
        config: NotificationConfig,
    ) {
        // ha ugyanaz a kulcs, mint az aktuális, ne csináljunk semmit
        if (this.currentKey === key) {
            return;
        }

        // előző notification eltávolítása
        if (this.currentKey) {
            notification.destroy(this.currentKey);
        }

        this.currentKey = key;

        const { title, onClose, ...rest } = config;

        notification[type]({
            ...rest,
            message: title,
            key,
            onClose: () => {
                if (this.currentKey === key) {
                    this.currentKey = null;
                }
                onClose?.();
            },
        });
    }

    error(key: string, config: NotificationConfig) {
        this.show("error", key, config);
    }

    warning(key: string, config: NotificationConfig) {
        this.show("warning", key, config);
    }

    success(key: string, config: NotificationConfig) {
        this.show("success", key, config);
    }

    info(key: string, config: NotificationConfig) {
        this.show("info", key, config);
    }

    destroyCurrent() {
        if (this.currentKey) {
            notification.destroy(this.currentKey);
            this.currentKey = null;
        }
    }
}

export const notificationManager = new NotificationManager();

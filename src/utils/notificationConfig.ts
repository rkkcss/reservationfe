// utils/notificationConfig.ts
import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification';

// global config - call it once in App.tsx

notification.config({
    placement: 'bottom',
    top: 80,
    duration: 4,
    maxCount: 1,
    rtl: false,
});
type NotificationConfig = Omit<ArgsProps, 'key' | 'type'> & { message: React.ReactNode };
// Notification manager - megakadályozza a duplikációt
class NotificationManager {
    private currentKey: string | null = null;
    private timeout: number | null = null; // ✅ number a setTimeout visszatérési értéke

    show(type: 'error' | 'warning' | 'success' | 'info', key: string, config: NotificationConfig) {
        // Ha ugyanaz a notification már aktív, ne mutasd újra
        if (this.currentKey === key) {
            return;
        }

        // Ha van aktív notification, zárjuk be
        if (this.currentKey) {
            notification.destroy(this.currentKey);
        }

        this.currentKey = key;

        const originalOnClose = config.onClose;

        notification[type]({
            ...config,
            key,
            onClose: () => {
                if (this.currentKey === key) {
                    this.currentKey = null;
                }
                originalOnClose?.();
            }
        } as Parameters<typeof notification[typeof type]>[0]);
        // Ensure notification is destroyed after duration
        this.timeout = window.setTimeout(() => {
            notification.destroy(key);
            this.currentKey = null;
        }, (config.duration || 4) * 1000);
        // Auto cleanup
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = window.setTimeout(() => { // ✅ window.setTimeout
            this.currentKey = null;
        }, (config.duration || 4) * 1000);
    }

    error(key: string, config: NotificationConfig) {
        this.show('error', key, config);
    }

    warning(key: string, config: NotificationConfig) {
        this.show('warning', key, config);
    }

    success(key: string, config: NotificationConfig) {
        this.show('success', key, config);
    }
}

export const notificationManager = new NotificationManager();
export const setupNotifications = () => {
    notification.config({
        placement: 'bottom',
        top: 80,
        duration: 4,
        maxCount: 1,
        rtl: false,
    });
};
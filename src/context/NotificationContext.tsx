import { createContext, useContext, ReactNode, useState, useEffect, SetStateAction, Dispatch, useRef, useMemo } from "react";
import { putNotificationRead } from "../helpers/queries/notification-queries";
import { Notification } from "../helpers/types/Notification";
import { RequestParams, usePagination } from "../hooks/usePagination";
import { useAppSelector } from "../store/hooks";
import API from "../utils/API";


type NotificationContextType = {
    markAsRead: (id: number) => void;
    currentBusinessUnreadCount: number,
    currentPage: number,
    fetchPage: (p: number) => Promise<void>
    totalItems: number
    fetchNextPage: () => "" | Promise<void> | null
    fetchPrevPage: () => "" | Promise<void> | null
    setRequestParams: Dispatch<SetStateAction<RequestParams>>
    setNotifications: Dispatch<SetStateAction<Notification[]>>,
    notifications: Notification[]
    unreadCountByUser: Map<number, number>
};

const NotificationContext = createContext<NotificationContextType>({
    markAsRead: () => { },
    currentBusinessUnreadCount: 0,
    currentPage: 1,
    fetchPage: () => Promise.resolve(),
    totalItems: 0,
    fetchNextPage: () => null,
    fetchPrevPage: () => null,
    setRequestParams: () => { },
    setNotifications: () => { },
    notifications: [],
    unreadCountByUser: new Map()
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const sseRef = useRef<EventSource | null>(null);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const [unreadCountByUser, setUnreadCountByUser] = useState<Map<number, number>>(new Map());

    const { data: notifications,
        setData: setNotifications,
        currentPage,
        fetchPage,
        totalItems,
        fetchNextPage,
        fetchPrevPage,
        setRequestParams
    } = usePagination<Notification[]>(
        selectedBusinessEmployee?.id
            ? `/api/notifications/${selectedBusinessEmployee.id}`
            : null, 10, "", {}, false
    );

    const currentBusinessUnreadCount = useMemo(() => {
        return selectedBusinessEmployee
            ? (unreadCountByUser.get(selectedBusinessEmployee.id) ?? 0)
            : 0;
    }, [selectedBusinessEmployee, unreadCountByUser]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        function connectSSE() {
            if (sseRef.current) {
                sseRef.current.close();
            }

            const es = new EventSource(`${import.meta.env.VITE_API_URL}api/notifications/stream`, {
                withCredentials: true
            });
            sseRef.current = es;

            es.addEventListener('heartbeat', () => { });

            es.onmessage = (e) => {
                const notification = JSON.parse(e.data);
                setNotifications(prev => [notification, ...prev]);
                setUnreadCountByUser(prev => {
                    const map = new Map(prev ?? []);
                    const beId = notification.businessEmployeeId;
                    if (!beId) return map;
                    map.set(beId, (map.get(beId) ?? 0) + 1);
                    return map;
                });
            };

            es.onerror = () => {
                es.close();
                sseRef.current = null;
                timeoutId = setTimeout(connectSSE, 3000);
            };
        }

        connectSSE();

        return () => {
            clearTimeout(timeoutId);
            sseRef.current?.close();
            sseRef.current = null;
        };
    }, []);

    useEffect(() => {
        API.get("/api/notifications/unread-counts")
            .then(res => {
                const map = new Map<number, number>(
                    Object.entries(res.data).map(([k, v]) => [Number(k), v as number])
                );
                setUnreadCountByUser(map);
            });
    }, []);

    const markAsRead = async (id: number) => {
        if (!selectedBusinessEmployee) return;
        
        //search notification, if its already read -> return
        const targetNotification = notifications.find(n => n.id === id);
        if (!targetNotification || targetNotification?.read) return;

        putNotificationRead(id, selectedBusinessEmployee.id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        // setUnreadCount(prev => prev - 1);
        setUnreadCountByUser(prev => {
            const map = new Map(prev ?? []);
            const beId = selectedBusinessEmployee.id;
            if (!beId) return map;
            const current = map.get(beId) ?? 0;
            map.set(beId, Math.max(0, current - 1));
            return map;
        });
    };

    return (
        <NotificationContext.Provider value={{
            markAsRead,
            currentBusinessUnreadCount,
            currentPage,
            fetchPage,
            totalItems,
            fetchNextPage,
            fetchPrevPage,
            setRequestParams,
            setNotifications,
            notifications,
            unreadCountByUser
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within a NotificationContext and can't be null");
    return context;
};

import { Notification } from '../../helpers/types/Notification';
import { useNavigate } from 'react-router';
import AllNotificationItem from '../../pages/AllNotification/AllNotificationItem';
import { Button } from 'antd';

type NotificationListProps = {
    notifications: Notification[];
    onRead: (id: number) => void;
    unreadCount: number;
    closeDropdown: () => void;
    totalItems: number
}

const NotificationList = ({ notifications, unreadCount, closeDropdown, totalItems }: NotificationListProps) => {
    const navigate = useNavigate()

    const navigateAndClose = (to: string) => {
        navigate(to)
        closeDropdown();
    }

    if (notifications.length === 0) {
        return (
            <div className="w-80 bg-white rounded-xl border border-gray-100 shadow-sm py-8 px-4 text-center">
                <p className="text-gray-400 text-sm">Nincs értesítésed</p>
            </div>
        );
    }

    return (
        <div className="w-96 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-800">Értesítések</span>
                {unreadCount > 0 && (
                    <Button type="link"
                        onClick={() => navigateAndClose("/notifications")}
                        className="text-xs text-right px-0 text-gray-400 underline underline-offset-2">
                        Összes
                    </Button>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {notifications.map((notification) => (
                    <AllNotificationItem key={notification.id} notification={notification} closeDropDown={closeDropdown} />
                ))}
                {
                    totalItems > 10 &&
                    <div className="py-2">
                        <Button
                            size="small"
                            type="link"
                            className="w-full text-sm"
                            onClick={() => navigateAndClose("/notifications")}
                        >Összes megtekintése</Button >
                    </div>
                }
            </div>
        </div >
    );
};

export default NotificationList;
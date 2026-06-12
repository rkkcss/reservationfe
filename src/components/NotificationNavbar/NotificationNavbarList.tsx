import { Notification } from '../../helpers/types/Notification';
import { Link } from 'react-router';
import AllNotificationItem from '../../pages/AllNotification/AllNotificationItem';

type NotificationListProps = {
    notifications: Notification[];
    onRead: (id: number) => void;
    unreadCount: number;
    closeDropdown: () => void;
}

const NotificationList = ({ notifications, unreadCount, closeDropdown }: NotificationListProps) => {
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
                    <Link to="/notifications" onClick={closeDropdown} className="text-xs text-gray-400 underline">Összes</Link>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {notifications.map((notification) => (
                    <AllNotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    );
};

export default NotificationList;
import { Notification } from '../../helpers/types/Notification';
import dayjs from 'dayjs';
import { NotificationRenderer } from './NotificationRenderer';
import { useNotifications } from '../../context/NotificationContext';

type Props = {
    notification: Notification;
};

const AllNotificationItem = ({ notification }: Props) => {
    const isUnread = !notification.read;
    const { markAsRead } = useNotifications();
    return (
        <div
            onClick={() => markAsRead(notification.id)}
            className="relative flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md cursor-pointer"
        >
            {isUnread && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-md" />
            )}

            <div className="flex items-start gap-4 pl-2">
                <NotificationRenderer notification={notification} />
            </div>

            <div className="text-right flex flex-col justify-center items-end min-w-[60px]">
                {isUnread ? (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Új</span>
                ) : (
                    <span className="text-xs font-medium text-gray-400">
                        {dayjs(notification.createdAt).format('HH:mm')}
                    </span>
                )}
            </div>
        </div>
    );
};

export default AllNotificationItem;
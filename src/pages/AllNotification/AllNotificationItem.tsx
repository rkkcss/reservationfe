import { Notification } from '../../helpers/types/Notification';
import dayjs from 'dayjs';
import { NotificationRenderer } from './NotificationRenderer';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router';

type Props = {
    notification: Notification;
    closeDropDown?: () => void;
};

const AllNotificationItem = ({ notification, closeDropDown }: Props) => {
    const isUnread = !notification.read;
    const { markAsRead } = useNotifications();
    const navigate = useNavigate();

    const handleOnClick = () => {
        if (notification && 'appointmentId' in notification.data) {
            const { appointmentId, date } = notification.data;
            const dateToNavigate = dayjs(date).format("YYYY-MM-DD");
            navigate(`/calendar?view=timeGridDay&date=${dateToNavigate}&employee=all&appointmentId=${appointmentId}`);
        }
        markAsRead(notification.id);
        closeDropDown?.();
    }
    return (
        <div
            onClick={() => handleOnClick()}
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
// components/AppointmentNotification.tsx
import { MdEventBusy, MdEventAvailable, MdOutlineEventNote } from "react-icons/md";
import { AppointmentNotificationData } from "../../helpers/types/Notification";
import dayjs from "dayjs";

const formatDate = (date: string) => dayjs(date).format('YYYY. MM. DD. HH:mm');

interface AppointmentNotificationProps {
    type: 'appointment.cancelled' | 'appointment.confirmed' | 'new.booking';
    data: AppointmentNotificationData;
}

export const AppointmentNotification = ({ type, data }: AppointmentNotificationProps) => {
    const config = {
        'appointment.cancelled': {
            title: 'Időpont lemondva',
            text: `${data.guestName} lemondta az időpontját (${formatDate(data.date)})`,
            icon: <MdEventBusy className="text-red-600" size={24} />,
            background: 'bg-red-200'
        },
        'appointment.confirmed': {
            title: 'Időpont megerősítve',
            text: `${data.guestName} megerősítette az időpontját (${formatDate(data.date)})`,
            icon: <MdEventAvailable className="text-green-600" size={24} />,
            background: 'bg-green-200'
        },
        'new.booking': {
            title: 'Új foglalás',
            text: `${data.guestName} új időpontot foglalt (${formatDate(data.date)})`,
            icon: <MdOutlineEventNote className="text-blue-600" size={24} />,
            background: 'bg-blue-200'
        }
    };

    const current = config[type];

    return (
        <div className="flex items-start gap-3">
            <div className={`text-xl mt-1 p-2 rounded-full ${current.background}`}>{current.icon}</div>
            <div>
                <h4 className="font-semibold text-sm">{current.title}</h4>
                <p className="text-xs text-gray-600">{current.text}</p>
            </div>
        </div>
    );
};
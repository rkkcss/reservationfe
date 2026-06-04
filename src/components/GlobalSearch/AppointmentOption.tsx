import { MdOutlineCalendarMonth } from "react-icons/md";
import { Appointment, APPOINTMENT_STATUSES_EXTENDED } from "../../helpers/types/Appointment";
import dayjs from "dayjs";
import { Badge } from "antd";

interface Props {
    item: Appointment;
    highlight: (text: string) => React.ReactNode;
}

export const AppointmentOption = ({ item, highlight }: Props) => {
    const formattedDate = item.startDate && item.endDate
        ? dayjs(item.startDate).format('YYYY.MM.DD. HH:mm') + ' - ' + dayjs(item.endDate).format('HH:mm')
        : item.guest?.name;

    return (
        <div className="flex flex-col p-1 relative">
            <p className="flex gap-1 items-center">
                {highlight(item.guest?.name ?? "")}
                <span>{highlight(item.guest?.email ?? "")}</span>
            </p>

            {formattedDate && (
                <p className="text-xs flex gap-1 mt-1 items-center text-blue-500">
                    <MdOutlineCalendarMonth size={16} /> {formattedDate}
                </p>
            )}

            {item.status && (
                <Badge
                    color={APPOINTMENT_STATUSES_EXTENDED[item.status].color}
                    count={APPOINTMENT_STATUSES_EXTENDED[item.status].label}
                    className="absolute right-2"
                />
            )}
        </div>
    );
};
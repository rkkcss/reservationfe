import dayjs from "dayjs";
import { Appointment } from "../../helpers/types/Appointment";
import { useCalendar } from "../../context/CalendarContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IoCalendarNumberOutline, IoCloseOutline } from "react-icons/io5";
import { Button, Popconfirm, Tooltip } from "antd";
import { BiShare } from "react-icons/bi";
import { approvePendingAppointmentByIdThunk, cancelPendingAppointmentByIdThunk } from "../../redux/appointmentsSlice";
import { FaCheck } from "react-icons/fa";

type PendingAppointmentProps = {
    appointment: Appointment;
}
const PendingAppointment = ({ appointment }: PendingAppointmentProps) => {
    const { calendarRef } = useCalendar();
    const dispatch = useAppDispatch();
    const { pendingAppointments } = useAppSelector((state) => state.appointmentStore);
    const { selectedBusinessEmployee } = useAppSelector((state) => state.userStore);


    const handleJumpToAppointment = (appointment: Appointment) => {
        if (pendingAppointments.length === 0 || !calendarRef.current) return;
        const calendarApi = calendarRef.current.getApi();
        if (!appointment?.startDate) {
            return;
        }
        calendarApi.gotoDate(appointment?.startDate.toString());
        onClose();
    }
    const formatDateTime = (startDate: string | Date | dayjs.Dayjs | undefined, endDate: string | Date | dayjs.Dayjs | undefined) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (start.format('YYYY.MM.DD') === end.format('YYYY.MM.DD')) {
            return (
                <>
                    <span className="font-semibold text-gray-700">
                        {start.format('YYYY.MM.DD. (dddd)')}
                    </span>
                    <span className="text-gray-500 mx-2">|</span>
                    <span className="font-bold text-lg text-blue-600">
                        {start.format('HH:mm')} - {end.format('HH:mm')}
                    </span>
                </>
            );
        }
        return (
            <>
                <span className="font-bold text-blue-600">
                    {start.format('YYYY.MM.DD. HH:mm')}
                </span>
                <span className="mx-1"> - </span>
                <span className="font-bold text-blue-600">
                    {end.format('YYYY.MM.DD. HH:mm')}
                </span>
            </>
        );
    };

    return (
        <li key={appointment.id} className="flex flex-col justify-between items-start p-4 border-b hover:bg-gray-50 transition duration-150 ease-in-out group relative">
            <div className="w-full">
                {/* Kiemelt cím vastagon, nagyobb betűmérettel */}
                <strong className="text-lg text-gray-900">
                    {appointment?.guest?.name}
                </strong>
                <p className="text-sm text-gray-600">
                    {appointment?.guest?.email}
                </p>
            </div>

            <div className="flex items-center justify-between w-full mt-1">
                <div className="flex items-center text-sm">
                    <IoCalendarNumberOutline className="mr-1 text-gray-500" size={16} />
                    {/* Itt használjuk az új formázó segédfüggvényt */}
                    {formatDateTime(appointment.startDate, appointment.endDate)}
                </div>

                <div className="flex absolute top-5 right-3 gap-2 group-hover:opacity-100 opacity-0 transition-opacity bg-gray-50">

                    <Button size="small" type="text" shape="round" icon={<BiShare />} onClick={() => handleJumpToAppointment(appointment)}>Ugrás oda</Button>
                    <Popconfirm
                        title="Biztosan jóváhagyod az időpontot?"
                        onConfirm={() => dispatch(approvePendingAppointmentByIdThunk({ appointmentId: appointment.id, employeeId: selectedBusinessEmployee?.user.id }))}
                        okText="Igen"
                        cancelText="Nem"
                    >
                        <Tooltip title="Jóváhagyás">
                            <Button icon={<FaCheck size={10} />} size="small" shape="circle" type="primary" />
                        </Tooltip>
                    </Popconfirm>
                    <Popconfirm title="Biztosan elutasítod az időpontot?"
                        onConfirm={() => dispatch(cancelPendingAppointmentByIdThunk({ appointmentId: appointment.id, employeeId: selectedBusinessEmployee?.user.id }))}
                        okText="Igen"
                        cancelText="Nem"
                    >
                        <Tooltip title="Elutasítás">
                            <Button icon={<IoCloseOutline size={16} />} size="small" shape="circle" danger type="primary" />
                        </Tooltip>
                    </Popconfirm>
                </div>
            </div>

        </li>
    )
}


export default PendingAppointment
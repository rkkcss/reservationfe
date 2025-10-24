import FullCalendar from '@fullcalendar/react';
import { Button, Drawer, Tooltip } from 'antd'
import React from 'react'
import { Appointment } from '../../helpers/types/Appointment';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa';
import { IoCalendarNumberOutline, IoCloseOutline } from 'react-icons/io5';
import { BiShare } from 'react-icons/bi';

type PendingAppointmentsListProps = {
    open: boolean;
    onClose: () => void;
    data: Appointment[];
    calendarRef: React.RefObject<FullCalendar>;
    onApprove: (id?: number) => void;
    onCancel: (id?: number) => void;
}

const PendingAppointmentsList = ({ calendarRef, open, onClose, data, onApprove, onCancel }: PendingAppointmentsListProps) => {
    const handleJumpToAppointment = (appointment: Appointment) => {
        if (data.length === 0 || !calendarRef?.current) return;
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
                        {start.format('HH:mm')} – {end.format('HH:mm')}
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
        <Drawer open={open} title="Függőben lévő időpontok" placement="right" width={600} onClose={onClose} destroyOnClose>
            <ul>
                {data?.map((appointment) => (
                    // Kártya stílus + padding, jobb vizuális elválasztás
                    <li key={appointment.id} className="flex flex-col justify-between items-start p-4 border-b hover:bg-gray-50 transition duration-150 ease-in-out group">
                        <div className="w-full">
                            {/* Kiemelt cím vastagon, nagyobb betűmérettel */}
                            <strong className="text-lg text-gray-900">
                                {appointment?.guest?.name}
                            </strong>
                        </div>

                        <div className="flex items-center justify-between w-full mt-1">
                            {/* Dátum és időpont szekció, ikonokkal és formázva */}
                            <div className="flex items-center text-sm">
                                <IoCalendarNumberOutline className="mr-1 text-gray-500" size={16} />
                                {/* Itt használjuk az új formázó segédfüggvényt */}
                                {formatDateTime(appointment.startDate, appointment.endDate)}
                            </div>

                            <div className="flex gap-2 justify-end group-hover:opacity-100 opacity-0 transition-opacity">
                                <Button size="small" type="link" icon={<BiShare />} onClick={() => handleJumpToAppointment(appointment)}>Ugrás oda</Button>
                                <Tooltip title="Jóváhagyás">
                                    <Button icon={<FaCheck size={10} />} size="small" shape="circle" type="primary" onClick={() => onApprove(appointment.id)} />
                                </Tooltip>
                                <Tooltip title="Elutasítás">
                                    <Button icon={<IoCloseOutline size={16} />} size="small" shape="circle" danger type="primary" onClick={() => onCancel(appointment.id)}></Button>
                                </Tooltip>
                            </div>
                        </div>

                    </li>
                ))}
            </ul>
        </Drawer >
    )
}

export default PendingAppointmentsList
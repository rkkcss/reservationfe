import FullCalendar from '@fullcalendar/react';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import AddAppointment from '../../components/Modals/AddAppointment';

type CalendarHeaderProps = {
    calendarRef: React.RefObject<FullCalendar>;
}

const CalendarHeader = ({ calendarRef }: CalendarHeaderProps) => {
    const [dateRange, setDateRange] = useState('');
    const [addAppointment, setAddAppointment] = useState(false);

    useEffect(() => {
        updateDateRange();
    }, [])

    const handleNext = () => {
        calendarRef.current?.getApi().next();
        updateDateRange();
    };

    const handlePrev = () => {
        calendarRef.current?.getApi().prev();
        updateDateRange();
    };

    const handleToday = () => {
        calendarRef.current?.getApi().today();
        updateDateRange();
    };

    const updateDateRange = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const view = calendarApi.view;
            const start = view.currentStart;
            const end = new Date(view.currentEnd.getTime() - 1);
            setDateRange(formatDateRange(start, end));
        }
    };

    const formatDateRange = (start: Date, end: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        const startStr = new Intl.DateTimeFormat('hu-HU', options).format(start);
        const endStr = new Intl.DateTimeFormat('hu-HU', options).format(
            new Date(end.getTime() - 1) // mert `end` már a következő nap 00:00
        );

        return `${startStr} - ${endStr}`;
    };

    return (
        <>
            <AddAppointment
                open={addAppointment}
                onClose={() => setAddAppointment(false)}
                onOk={() => console.log("asd")}
            />

            <div className="flex items-center mt-8 mb-2 justify-center">
                <Button onClick={handleToday} type="default" className="ml-0 mr-auto">
                    Ma
                </Button>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handlePrev}
                        icon={<FaAngleLeft size={16} />}
                        type="text"
                    />
                    <p className="text-xl font-semibold">{dateRange}</p>
                    <Button
                        onClick={handleNext}
                        icon={<FaAngleRight size={16} />}
                        type="text"
                    />
                </div>
                <Button type="primary" className="ml-auto mr-0" onClick={() => setAddAppointment(true)}>
                    +
                </Button>
            </div>
        </>
    )
}

export default CalendarHeader
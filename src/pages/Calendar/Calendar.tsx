import { useEffect, useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import huLocal from '@fullcalendar/core/locales/hu';
import dayjs from 'dayjs';
import { notification } from 'antd';

import AddAppointmentAdmin from '../../components/Modals/AddAppointmentAdmin';
import CalendarHeader from './CalendarHeader';
import {
    createAppointmentByOwnerQuery,
    patchAppointmentQuery,
    deleteAppointmentQuery,
} from '../../helpers/queries/appointmentService';

import type { DateSelectArg, DatesSetArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { Appointment } from '../../helpers/types/Appointment';
import { appointmentToEvent, eventToAppointment } from '../../utils/calendarEventUtils';
import { useCustomQuery } from '../../hooks/useAppointments';
import PendingAppointments from '../../components/PendingAppointments';

const CalendarPage = () => {
    const { data, fetchData } = useCustomQuery({ url: "/api/appointments" });
    const [formattedEvents, setFormattedEvents] = useState<EventInput[]>([]);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment>({} as Appointment);

    const calendarRef = useRef<FullCalendar | null>(null);

    const handleDatesSet = useCallback((arg: DatesSetArg) => {
        const start = arg.start;
        const end = new Date(arg.end.getTime() - 1);
        fetchData({ params: { startDate: start, endDate: end } });
    }, []);

    const handleEventClick = useCallback((clickInfo: EventClickArg) => {
        setSelectedAppointment(eventToAppointment(clickInfo.event));
        setAppointmentModalOpen(true);
    }, []);

    const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
        setSelectedAppointment({
            startDate: dayjs(selectInfo.start),
            endDate: dayjs(selectInfo.end),
        } as Appointment);
        setAppointmentModalOpen(true);
    }, []);

    const handleAddAppointmentAdmin = useCallback((newAppointment: Appointment) => {
        const save = newAppointment.id ? patchAppointmentQuery : createAppointmentByOwnerQuery;
        save(newAppointment).then((res) => {
            const updatedEvent = appointmentToEvent(res.data);
            setFormattedEvents((prev) =>
                newAppointment.id
                    ? prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
                    : [...prev, updatedEvent]
            );
            notification.success({
                message: `Időpont ${newAppointment.id ? 'frissítve' : 'hozzáadva'}!`,
                placement: 'bottom',
            });
        });
        setAppointmentModalOpen(false);
    }, []);

    const handleDeleteAppointment = useCallback((appointmentId: number) => {
        setFormattedEvents((prev) => prev.filter((e) => e.id !== appointmentId.toString()));
        deleteAppointmentQuery(appointmentId).then(() => {
            notification.success({ message: 'Időpont sikeresen törölve!', placement: 'bottom' });
        });
    }, []);

    useEffect(() => {
        setFormattedEvents(data.map(appointmentToEvent));
    }, [data]);


    return (
        <>
            <AddAppointmentAdmin
                open={appointmentModalOpen}
                onClose={() => setAppointmentModalOpen(false)}
                appointment={selectedAppointment}
                onOk={handleAddAppointmentAdmin}
                deleteAppointment={handleDeleteAppointment}
                key={selectedAppointment?.startDate?.toString() || 'new-appointment'}
            />
            <div className="mt-4 flex justify-end">
                <PendingAppointments />
            </div>

            <CalendarHeader calendarRef={calendarRef} />

            <FullCalendar
                ref={calendarRef}
                viewClassNames="mt-4"
                height={'80vh'}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={huLocal}
                headerToolbar={false}
                events={[...formattedEvents]}
                datesSet={handleDatesSet}
                eventClick={handleEventClick}
                selectable={true}
                select={handleDateSelect}
                eventClassNames="cursor-pointer hover:outline hover:opacity-80 hover:outline-2 hover:outline-blue-500 hover:outline-offset-1 duration-50 border-none transition-ease-in-out"
                slotLabelClassNames="cursor-pointer hover:bg-blue-100 duration-50 transition-ease-in-out"
            />
        </>
    );
};

export default CalendarPage;

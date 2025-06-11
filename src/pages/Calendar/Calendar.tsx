import { useEffect, useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import huLocal from '@fullcalendar/core/locales/hu';
import dayjs from 'dayjs';

import { createAppointmentByOwnerQuery, deleteAppointmentQuery, getAppointmentsBetween, patchAppointmentQuery } from '../../helpers/queries/appointmentService';
import { Appointment } from '../../helpers/types/Appointment';
import CalendarHeader from './CalendarHeader';
import AddAppointmentAdmin from '../../components/Modals/AddAppointmentAdmin';

import type {
    DateSelectArg,
    DatesSetArg,
    EventClickArg,
    EventInput,
} from '@fullcalendar/core';
import { notification } from 'antd';
import { EventImpl } from '@fullcalendar/core/internal';

const statusColors: Record<string, string> = {
    PENDING: '#6c757d',
    CONFIRMED: '#28a745',
    CANCELLED: '#dc3545',
    DEFAULT: '#6c757d',
};

const CalendarPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [formattedEvents, setFormattedEvents] = useState<EventInput[]>([]);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment>({} as Appointment);

    const calendarRef = useRef<FullCalendar | null>(null);

    const appointmentToEvent = (app: Appointment): EventInput => {
        const status = Array.isArray(app.status)
            ? Object.values(app.status[0])[0]
            : app.status;
        const colorKey = String(status) as keyof typeof statusColors;

        return {
            id: app.id?.toString(),
            title: app.guest?.name || 'Nincs megadva',
            start: dayjs(app.startDate).toISOString(),
            end: dayjs(app.endDate).toISOString(),
            backgroundColor: statusColors[colorKey] || statusColors.DEFAULT,
            textColor: '#fff',
            extendedProps: {
                status,
                guest: app.guest,
                offering: app.offering,
                note: app.note || '',
            },
        };
    };

    const eventToAppointment = (event: EventImpl) => {
        return {
            id: event.id ? parseInt(event.id, 10) : undefined,
            startDate: dayjs(event.start),
            endDate: dayjs(event.end),
            guest: event.extendedProps.guest,
            status: event.extendedProps.status,
            note: event.extendedProps.note || '',
            offering: event.extendedProps.offering,
        } as Appointment;
    }

    const handleDatesSet = useCallback((arg: DatesSetArg) => {
        const start = arg.start;
        const end = new Date(arg.end.getTime() - 1);

        getAppointmentsBetween({ startDate: start, endDate: end }).then((res) => {
            setAppointments(res.data);
        });
    }, []);

    const transformAppointmentsToEvents = useCallback(
        (apps: Appointment[]): EventInput[] => {
            return apps
                .filter((app) => app.startDate && app.endDate)
                .map(appointmentToEvent);
        },
        []
    );

    useEffect(() => {
        if (appointments.length > 0) {
            const events = transformAppointmentsToEvents(appointments);
            setFormattedEvents(events);
        } else {
            setFormattedEvents([]);
        }
    }, [appointments, transformAppointmentsToEvents]);

    const handleEventClick = useCallback((clickInfo: EventClickArg) => {
        console.log('Kattintott esemény:', clickInfo.event);
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
        if (newAppointment.id) {
            patchAppointmentQuery(newAppointment)
                .then((res) => {
                    console.log('Időpont frissítve:', res.data);
                    const updatedEvent = appointmentToEvent(res.data);

                    setFormattedEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.id === updatedEvent.id ? updatedEvent : event
                        )
                    );
                    notification.success({ message: 'Időpont sikeresen frissítve!', placement: 'bottom' });
                })
        } else {
            createAppointmentByOwnerQuery(newAppointment)
                .then((res) => {
                    console.log('Új időpont hozzáadva:', res.data);
                    const newEvent = appointmentToEvent(res.data);

                    setFormattedEvents((prevEvents) => [...prevEvents, newEvent]);
                    notification.success({ message: 'Időpont sikeresen hozzáadva!', placement: 'bottom' });
                });
        }

    }, []);

    const handleDeleteAppointment = useCallback((appointmentId: number) => {
        setFormattedEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== appointmentId.toString())
        );
        deleteAppointmentQuery(appointmentId)
            .then(() => {
                notification.success({ message: 'Időpont sikeresen törölve!', placement: 'bottom' });
            });

    }, []);

    return (
        <>
            <AddAppointmentAdmin
                open={appointmentModalOpen}
                onClose={() => setAppointmentModalOpen(false)}
                appointment={selectedAppointment || ({} as Appointment)}
                onOk={handleAddAppointmentAdmin}
                deleteAppointment={handleDeleteAppointment}
                key={selectedAppointment?.startDate?.toString() || selectedAppointment?.endDate?.toString() || 'new-appointment'}
            />

            <CalendarHeader calendarRef={calendarRef} />

            <FullCalendar
                ref={calendarRef}
                viewClassNames="max-h-[50dvh] mt-4"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={huLocal}
                themeSystem="bootstrap"
                headerToolbar={false}
                events={formattedEvents}
                datesSet={handleDatesSet}
                eventClick={handleEventClick}
                selectable={true}
                select={handleDateSelect}
                eventClassNames="cursor-pointer hover:outline hover:opacity-80 hover:outline-2 hover:outline-blue-500 hover:outline-offset-1 duration-50 border-none transition-ease-in-out"
                slotLabelClassNames={"cursor-pointer hover:bg-blue-100 duration-50 transition-ease-in-out"}
            />
        </>
    );
};

export default CalendarPage;

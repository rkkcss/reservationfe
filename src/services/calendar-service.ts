// helpers/calendarEventUtils.ts

import { EventImpl } from '@fullcalendar/core/internal';
import dayjs from 'dayjs';
import { EventInput } from '@fullcalendar/core';
import { Appointment } from '../helpers/types/Appointment';

const statusColors: Record<string, string> = {
    PENDING: '#6c757d',
    CONFIRMED: '#28a745',
    CANCELLED: '#dc3545',
    DEFAULT: '#6c757d',
};

export const appointmentToEvent = (app: Appointment): EventInput => {
    const status = Array.isArray(app.status)
        ? Object.values(app.status[0])[0]
        : app.status;
    const colorKey = String(status) as keyof typeof statusColors;
    // console.log("formatting", app)
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

export const eventToAppointment = (event: EventImpl): Appointment => ({
    id: event.id ? parseInt(event.id, 10) : null,
    startDate: dayjs(event.start),
    endDate: dayjs(event.end),
    guest: event.extendedProps.guest,
    status: event.extendedProps.status,
    note: event.extendedProps.note || '',
    offering: event.extendedProps.offering,
});

// helpers/calendar-service.ts

import { EventImpl } from "@fullcalendar/core/internal";
import dayjs from "dayjs";
import { EventInput } from "@fullcalendar/core";
import { Appointment } from "../helpers/types/Appointment";
import { readableColor } from "polished";
import { TIME_OFF_TYPES, TimeOff } from "../helpers/types/TimeOff";

const timeOffTypeLabels: Record<string, string> = {
    [TIME_OFF_TYPES.VACATION]: "Szabadság",
    [TIME_OFF_TYPES.SICK_LEAVE]: "Betegszabadság",
    [TIME_OFF_TYPES.OTHER]: "Egyéb",
};

const timeOffColor = "#9ca3af";

export const timeOffToEvent = (timeOff: TimeOff): EventInput => {
    const isFullDay = !timeOff.startTime && !timeOff.endTime;

    const start = isFullDay
        ? timeOff.startDate
        : dayjs(`${timeOff.startDate}T${timeOff.startTime}`).toISOString();

    const end = isFullDay
        ? dayjs(timeOff.endDate).add(1, "day").format("YYYY-MM-DD")
        : dayjs(`${timeOff.endDate}T${timeOff.endTime}`).toISOString();

    return {
        id: `timeoff-${timeOff.id}`,
        title: timeOffTypeLabels[timeOff.type] || "Szabadság",
        start,
        end,
        allDay: isFullDay,
        backgroundColor: timeOffColor,
        borderColor: timeOffColor,
        textColor: readableColor(timeOffColor),
        className: "event-timeoff",
        extendedProps: {
            eventType: "timeoff", // hogy megkülönböztessük az appointment-től eventClick-nél
            type: timeOff.type,
            note: timeOff.note || "",
            businessEmployee: timeOff.businessEmployee,
        },
    };
};

export const eventToTimeOff = (event: EventImpl): TimeOff => ({
    id: event.id ? parseInt(event.id.replace("timeoff-", ""), 10) : null,
    businessEmployee: event.extendedProps.businessEmployee,
    startDate: dayjs(event.start).format("YYYY-MM-DD"),
    endDate: dayjs(event.end).format("YYYY-MM-DD"),
    startTime: event.allDay ? null : dayjs(event.start).format("HH:mm"),
    endTime: event.allDay ? null : dayjs(event.end).format("HH:mm"),
    type: event.extendedProps.type,
    note: event.extendedProps.note || "",
});

const statusColors: Record<string, string> = {
    PENDING: "#6c757d",
    CONFIRMED: "#28a745",
    CANCELLED: "#dc3545",
    DEFAULT: "#6c757d",
};

const eventClassNames: Record<string, string> = {
    PENDING: "event-pending",
    CONFIRMED: "event-confirmed",
    CANCELLED: "event-cancelled",
    DEFAULT: "event-default",
};

export const appointmentToEvent = (app: Appointment): EventInput => {
    console.log("formatting", app);
    const status = Array.isArray(app.status)
        ? Object.values(app.status[0])[0]
        : app.status;
    const colorKey = String(status) as keyof typeof statusColors;

    return {
        id: app.id?.toString(),
        title: app.guest?.name || "Nincs megadva",
        start: dayjs(app.startDate).toISOString(),
        end: dayjs(app.endDate).toISOString(),
        backgroundColor: app?.offering?.color || "#ffffff",
        borderColor: statusColors[colorKey] || statusColors["DEFAULT"],
        className: eventClassNames[colorKey] || eventClassNames["DEFAULT"],
        textColor: app?.offering?.color
            ? readableColor(app.offering.color)
            : "#000000",
        extendedProps: {
            status,
            guest: app.guest,
            offering: app.offering,
            note: app.note || "",
            businessEmployee: app.businessEmployee,
        },
    };
};

export const eventToAppointment = (event: EventImpl): Appointment => ({
    id: event.id ? parseInt(event.id, 10) : null,
    startDate: dayjs(event.start),
    endDate: dayjs(event.end),
    guest: event.extendedProps.guest,
    status: event.extendedProps.status,
    note: event.extendedProps.note || "",
    offering: event.extendedProps.offering,
    businessEmployee: event.extendedProps.businessEmployee,
});

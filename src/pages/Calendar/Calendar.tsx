import { useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import huLocal from "@fullcalendar/core/locales/hu";
import dayjs from "dayjs";
import { Appointment } from "../../helpers/types/Appointment";
import { appointmentToEvent, eventToAppointment } from "../../services/calendar-service";
import { useCalendar } from "../../context/CalendarContext";
import AddAppointmentAdmin from "../../components/Modals/AddAppointmentAdmin";
import PendingAppointments from "../../components/PendingAppointments/PendingAppointments";
import CalendarHeader from "./CalendarHeader";
import type { DateSelectArg, DatesSetArg, EventClickArg, EventInput } from "@fullcalendar/core";
import { useAppDispatch } from "../../store/hooks";
import { createAppointmentThunk, deleteAppointmentThunk, fetchAppointmentsBetween, updateAppointmentThunk } from "../../redux/appointmentsSlice";
import { useSelector } from "react-redux";
import { AppointmentStore } from "../../store/store";

const CalendarPage = () => {
    const dispatch = useAppDispatch();
    const { appointments } = useSelector((state: AppointmentStore) => state.appointmentStore);

    const formattedAppointments = useMemo<EventInput[]>(() => {
        return appointments.map(appointmentToEvent);
    }, [appointments]);

    const { calendarRef } = useCalendar();

    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment>({} as Appointment);
    const [dateRange, setDateRange] = useState("");

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

    const handleDatesSet = useCallback(
        (arg: DatesSetArg) => {
            computeDateRange(arg);
            dispatch(fetchAppointmentsBetween({ startDate: arg.start, endDate: arg.end }));
        },
        [dispatch]
    );

    const computeDateRange = (arg: DatesSetArg) => {
        const start = arg.start;
        const end = new Date(arg.end.getTime() - 1);
        const fmt: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
        const startStr = new Intl.DateTimeFormat("hu-HU", fmt).format(start);
        const endStr = new Intl.DateTimeFormat("hu-HU", fmt).format(end);
        setDateRange(`${startStr} - ${endStr}`);
    };

    const handleAddAppointment = (appointment: Appointment) => {
        if (!appointment.id) {
            dispatch(createAppointmentThunk(appointment));
        } else {
            dispatch(updateAppointmentThunk(appointment));
        }
    }
    const handleDeleteAppointment = (appointmentId: number) => {
        if (appointmentId) {
            dispatch(deleteAppointmentThunk(appointmentId));
        }
    }

    return (
        <>
            <AddAppointmentAdmin
                open={appointmentModalOpen}
                onClose={() => {
                    setAppointmentModalOpen(false)
                    setSelectedAppointment({} as Appointment);
                }}
                appointment={selectedAppointment}
                onOk={handleAddAppointment}
                deleteAppointment={handleDeleteAppointment}
                key={selectedAppointment?.startDate?.toString() || "new-appointment"}
            />

            <div className="mt-4">
                <PendingAppointments />
            </div>

            <CalendarHeader dateRange={dateRange} />

            <FullCalendar
                ref={calendarRef}
                viewClassNames="mt-4"
                height="70vh"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={huLocal}
                headerToolbar={false}
                events={formattedAppointments}
                datesSet={handleDatesSet}
                eventClick={handleEventClick}
                selectable
                select={handleDateSelect}
                eventClassNames="cursor-pointer hover:outline hover:opacity-80 hover:outline-2 hover:outline-blue-500 hover:outline-offset-1 duration-50 border-none transition-ease-in-out"
                slotLabelClassNames="cursor-pointer hover:bg-blue-100 duration-50 transition-ease-in-out"
            />
        </>
    );
};

export default CalendarPage;

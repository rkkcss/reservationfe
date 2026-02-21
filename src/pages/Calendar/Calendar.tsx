import { useState, useCallback, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import huLocal from "@fullcalendar/core/locales/hu";
import dayjs from "dayjs";
import { Appointment, CreateAdminAppointmentRequest } from "../../helpers/types/Appointment";
import { appointmentToEvent, eventToAppointment } from "../../services/calendar-service";
import { useCalendar } from "../../context/CalendarContext";
import AddAppointmentAdmin from "../../components/Modals/AddAppointmentAdmin/AddAppointmentAdmin";
import PendingAppointments from "../../components/PendingAppointments/PendingAppointments";
import CalendarHeader from "./CalendarHeader";
import type { DateSelectArg, DatesSetArg, EventClickArg, EventInput } from "@fullcalendar/core";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createAppointmentThunk, deleteAppointmentThunk, fetchAppointmentsBetween, updateAppointmentThunk } from "../../redux/appointmentsSlice";
import { useSelector } from "react-redux";
import { UserStore } from "../../store/store";
import { BusinessEmployee } from "../../helpers/types/BusinessEmployee";
import { getEmployeesByBusinessId } from "../../helpers/queries/business-employee";

const CalendarPage = () => {
    const dispatch = useAppDispatch();
    const { appointments } = useAppSelector((state) => state.appointmentStore);
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const [employees, setEmployees] = useState<BusinessEmployee[]>([]);

    useEffect(() => {
        getEmployeesByBusinessId(Number(selectedBusinessEmployee?.business.id))
            .then((res) => setEmployees(res.data));
    }, [])

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
        (arg: DatesSetArg, name?: string) => {
            computeDateRange(arg);
            if (!name) return;
            dispatch(fetchAppointmentsBetween({
                businessId: Number(selectedBusinessEmployee?.business.id),
                employeeName: name,
                startDate: arg.start,
                endDate: arg.end,
            }));
        },
        [dispatch, selectedBusinessEmployee]
    );


    const computeDateRange = (arg: DatesSetArg) => {
        const start = arg.start;
        const end = new Date(arg.end.getTime() - 1);
        const fmt: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
        const startStr = new Intl.DateTimeFormat("hu-HU", fmt).format(start);
        const endStr = new Intl.DateTimeFormat("hu-HU", fmt).format(end);
        setDateRange(`${startStr} - ${endStr}`);
    };

    const handleAddAppointment = (appointment: CreateAdminAppointmentRequest) => {
        if (!appointment.id) {
            dispatch(createAppointmentThunk({
                businessId: Number(selectedBusinessEmployee?.business.id),
                employeeId: appointment.employeeId ?? Number(selectedBusinessEmployee?.user.id),
                appointment
            }));
        } else {
            dispatch(updateAppointmentThunk({ businessId: Number(selectedBusinessEmployee?.business.id), appointment }));
        }
    }
    const handleDeleteAppointment = (appointmentId: number) => {
        if (appointmentId) {
            dispatch(deleteAppointmentThunk(appointmentId));
        }
    }

    const handleEmployeeChange = (name: string) => {
        const calendarApi = calendarRef.current?.getApi();
        if (!calendarApi) return;

        const view = calendarApi.view;

        const arg: DatesSetArg = {
            start: view.activeStart,
            end: view.activeEnd,
            startStr: view.activeStart.toISOString(),
            endStr: view.activeEnd.toISOString(),
            view,
            timeZone: calendarApi.getOption("timeZone") ?? "local",
        };

        handleDatesSet(arg, name);
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
            <div className="p-4 mt-7 rounded-xl border border-gray-300 bg-white">
                <CalendarHeader dateRange={dateRange} employees={employees} handleEmployeeChange={handleEmployeeChange} />
            </div>

            <FullCalendar
                ref={calendarRef}
                viewClassNames="mt-4 bg-white"
                height="70vh"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={huLocal}
                headerToolbar={false}
                events={formattedAppointments}
                datesSet={(arg) => handleDatesSet(arg, "all")}
                eventClick={handleEventClick}
                selectable
                select={handleDateSelect}
                eventClassNames="cursor-pointer hover:outline hover:opacity-80 hover:outline-2 hover:outline-blue-500 hover:outline-offset-1 duration-50 border-none transition-ease-in-out"
                slotLabelClassNames="cursor-pointer hover:bg-blue-100 duration-50 transition-ease-in-out"
                nowIndicator
            />
        </>
    );
};

export default CalendarPage;

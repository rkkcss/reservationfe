import { useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import huLocal from "@fullcalendar/core/locales/hu";
import type { DatesSetArg, EventInput } from "@fullcalendar/core";
import { useSelector } from "react-redux";
import { appointmentToEvent } from "../../services/calendar-service";
import { useCalendar } from "../../context/CalendarContext";
import AddAppointmentAdmin from "../../components/Modals/AddAppointmentAdmin/AddAppointmentAdmin";
import PendingAppointments from "../../components/PendingAppointments/PendingAppointments";
import CalendarHeader from "./CalendarHeader";
import { useAppSelector } from "../../store/hooks";
import { UserStore } from "../../store/store";
import { useEmployees } from "./useEmployees";
import { useCalendarUrlSync } from "./useCalendarUrlSync";
import { useAppointmentsFetch } from "./useAppointmentsFetch";
import { useDateRangeLabel } from "./useDateRangeLabel";
import { useAppointmentModal } from "./useAppointmentModal";

const CalendarPage = () => {
    const { appointments } = useAppSelector((state) => state.appointmentStore);
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const businessId = selectedBusinessEmployee?.business.id;

    const { calendarRef } = useCalendar();
    const employees = useEmployees();

    const { urlView, urlDate, urlEmployee, syncUrlFromCalendar } = useCalendarUrlSync(
    calendarRef,
    (arg, employeeName) => fetchAppointmentsForRange(arg, employeeName)
);
    const { fetchAppointmentsForRange } = useAppointmentsFetch(businessId);
    const { dateRange, updateDateRangeLabel } = useDateRangeLabel();
    const {
        isOpen: appointmentModalOpen,
        selectedAppointment,
        openForEdit,
        openForCreate,
        close: closeAppointmentModal,
        save: saveAppointment,
        remove: removeAppointment,
    } = useAppointmentModal(businessId, selectedBusinessEmployee?.user.id);

    const formattedAppointments = useMemo<EventInput[]>(
        () => appointments.map(appointmentToEvent),
        [appointments]
    );

    const handleDatesSet = useCallback(
        (arg: DatesSetArg, employeeName: string) => {
            updateDateRangeLabel(arg);
            syncUrlFromCalendar(arg, employeeName);
            fetchAppointmentsForRange(arg, employeeName);
        },
        [updateDateRangeLabel, syncUrlFromCalendar, fetchAppointmentsForRange]
    );

    const handleEmployeeChange = useCallback(
        (name: string) => {
            const calendarApi = calendarRef.current?.getApi();
            if (!calendarApi) return;

            const view = calendarApi.view;
            handleDatesSet(
                {
                    start: view.activeStart,
                    end: view.activeEnd,
                    startStr: view.activeStart.toISOString(),
                    endStr: view.activeEnd.toISOString(),
                    view,
                    timeZone: calendarApi.getOption("timeZone") ?? "local",
                } as DatesSetArg,
                name
            );
        },
        [calendarRef, handleDatesSet]
    );

    return (
        <>
            <AddAppointmentAdmin
                open={appointmentModalOpen}
                onClose={closeAppointmentModal}
                appointment={selectedAppointment}
                onOk={saveAppointment}
                deleteAppointment={removeAppointment}
                key={selectedAppointment?.startDate?.toString() || "new-appointment"}
            />

            <div className="mt-4">
                <PendingAppointments />
            </div>
            <div className="pb-4 rounded-xl">
                <CalendarHeader
                    dateRange={dateRange}
                    employees={employees}
                    handleEmployeeChange={handleEmployeeChange}
                />
            </div>

            <FullCalendar
                ref={calendarRef}
                viewClassNames="mt-4 bg-white"
                height="70vh"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={urlView}
                initialDate={urlDate}
                locale={huLocal}
                headerToolbar={false}
                events={formattedAppointments}
                datesSet={(arg) => handleDatesSet(arg, urlEmployee)}
                eventClick={openForEdit}
                selectable
                select={openForCreate}
                eventClassNames="cursor-pointer hover:outline hover:opacity-80 hover:outline-2 hover:outline-blue-500 hover:outline-offset-1 duration-50 border-none transition-ease-in-out"
                slotLabelClassNames="cursor-pointer hover:bg-blue-100 duration-50 transition-ease-in-out"
                nowIndicator
                longPressDelay={350}
            />
        </>
    );
};

export default CalendarPage;
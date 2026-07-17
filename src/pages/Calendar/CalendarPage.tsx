import { useCallback, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import huLocal from "@fullcalendar/core/locales/hu";
import type {
    DateSelectArg,
    DatesSetArg,
    EventClickArg,
    EventInput,
} from "@fullcalendar/core";
import { useSelector } from "react-redux";

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
import {
    appointmentToEvent,
    timeOffToEvent,
} from "../../services/calendar-service";
import AddTimeOffModal from "../../components/Modals/AddAppointmentAdmin/AddTimeOffModal";
import EventTypePickerModal from "../../components/Modals/AddAppointmentAdmin/EventTypePickerModal";
import { useTimeOffsFetch } from "../../components/Modals/AddAppointmentAdmin/useTimeOffsFetch";
import { useTimeOffModal } from "./useTimeOffModal";

const CalendarPage = () => {
    const { appointments } = useAppSelector((state) => state.appointmentStore);
    const { timeOffs } = useAppSelector((state) => state.timeOffStore);

    const { selectedBusinessEmployee } = useSelector(
        (state: UserStore) => state.userStore,
    );
    const businessId = selectedBusinessEmployee?.business.id;

    const { calendarRef } = useCalendar();
    const employees = useEmployees();

    const { fetchAppointmentsForRange } = useAppointmentsFetch();
    const { fetchTimeOffsForRange } = useTimeOffsFetch();

    const { urlView, urlDate, urlEmployee, syncUrlFromCalendar } =
        useCalendarUrlSync(calendarRef, (arg, employeeId) => {
            fetchAppointmentsForRange(arg, employeeId);
            fetchTimeOffsForRange(arg, employeeId);
        });

    const { dateRange, updateDateRangeLabel } = useDateRangeLabel();

    const {
        isOpen: appointmentModalOpen,
        selectedAppointment,
        openForEdit: openAppointmentForEdit,
        openForCreate: openAppointmentForCreate,
        close: closeAppointmentModal,
        save: saveAppointment,
        remove: removeAppointment,
    } = useAppointmentModal(businessId, selectedBusinessEmployee?.user.id);

    const {
        isOpen: timeOffModalOpen,
        selectedTimeOff,
        openForEdit: openTimeOffForEdit,
        openForCreate: openTimeOffForCreate,
        close: closeTimeOffModal,
        save: saveTimeOff,
        remove: removeTimeOff,
    } = useTimeOffModal(businessId);

    // A picker csak akkor jelenik meg, ha van "pending" kiválasztás (select esemény)
    const [pendingSelection, setPendingSelection] =
        useState<DateSelectArg | null>(null);

    const formattedAppointments = useMemo<EventInput[]>(
        () => appointments.map(appointmentToEvent),
        [appointments],
    );

    const formattedTimeOffs = useMemo<EventInput[]>(
        () => timeOffs.map(timeOffToEvent),
        [timeOffs],
    );

    const allEvents = useMemo<EventInput[]>(
        () => [...formattedAppointments, ...formattedTimeOffs],
        [formattedAppointments, formattedTimeOffs],
    );

    const handleDatesSet = useCallback(
        (arg: DatesSetArg, employeeId: string) => {
            updateDateRangeLabel(arg);
            syncUrlFromCalendar(arg, employeeId);
            fetchAppointmentsForRange(arg, employeeId);
            fetchTimeOffsForRange(arg, employeeId);
        },
        [
            updateDateRangeLabel,
            syncUrlFromCalendar,
            fetchAppointmentsForRange,
            fetchTimeOffsForRange,
        ],
    );

    const handleEmployeeChange = useCallback(
        (employeeId: string) => {
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
                employeeId,
            );
        },
        [calendarRef, handleDatesSet],
    );

    // Meglévő eseményre kattintás -> extendedProps.eventType dönt
    const handleEventClick = useCallback(
        (clickInfo: EventClickArg) => {
            const eventType = clickInfo.event.extendedProps.eventType;
            if (eventType === "timeoff") {
                openTimeOffForEdit(clickInfo);
            } else {
                openAppointmentForEdit(clickInfo);
            }
        },
        [openAppointmentForEdit, openTimeOffForEdit],
    );

    // Üres időre kattintás -> picker nyílik, nem közvetlenül a modal
    const handleSelect = useCallback((selectInfo: DateSelectArg) => {
        setPendingSelection(selectInfo);
    }, []);

    const closePicker = useCallback(() => setPendingSelection(null), []);

    const handlePickAppointment = useCallback(() => {
        if (pendingSelection) openAppointmentForCreate(pendingSelection);
        setPendingSelection(null);
    }, [pendingSelection, openAppointmentForCreate]);

    const handlePickTimeOff = useCallback(() => {
        if (pendingSelection) openTimeOffForCreate(pendingSelection);
        setPendingSelection(null);
    }, [pendingSelection, openTimeOffForCreate]);

    return (
        <>
            <AddAppointmentAdmin
                open={appointmentModalOpen}
                onClose={closeAppointmentModal}
                appointment={selectedAppointment}
                onOk={saveAppointment}
                deleteAppointment={removeAppointment}
                key={
                    selectedAppointment?.startDate?.toString() ||
                    "new-appointment"
                }
            />

            <AddTimeOffModal
                open={timeOffModalOpen}
                onClose={closeTimeOffModal}
                timeOff={selectedTimeOff}
                onOk={saveTimeOff}
                deleteTimeOff={removeTimeOff}
                key={selectedTimeOff?.startDate?.toString() || "new-timeoff"}
            />

            <EventTypePickerModal
                open={!!pendingSelection}
                onClose={closePicker}
                onPickAppointment={handlePickAppointment}
                onPickTimeOff={handlePickTimeOff}
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
                events={allEvents}
                datesSet={(arg) => handleDatesSet(arg, urlEmployee)}
                eventClick={handleEventClick}
                selectable
                select={handleSelect}
                eventClassNames="cursor-pointer hover:outline hover:opacity-80 hover:outline-2 hover:outline-blue-500 hover:outline-offset-1 duration-50 border-none transition-ease-in-out"
                slotLabelClassNames="cursor-pointer hover:bg-blue-100 duration-50 transition-ease-in-out"
                nowIndicator
                longPressDelay={350}
            />
        </>
    );
};

export default CalendarPage;

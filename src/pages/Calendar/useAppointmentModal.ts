import { useCallback, useState } from "react";
import dayjs from "dayjs";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";

import { useAppDispatch } from "../../store/hooks";
import { Appointment, CreateAdminAppointmentRequest } from "../../helpers/types/Appointment";
import { eventToAppointment } from "../../services/calendar-service";
import { createAppointmentThunk, deleteAppointmentThunk, updateAppointmentThunk } from "../../redux/appointmentsSlice";

export function useAppointmentModal(
    businessId: number | string | undefined | null,
    fallbackEmployeeId: number | string | undefined
) {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment>({} as Appointment);

    const openForEdit = useCallback((clickInfo: EventClickArg) => {
        setSelectedAppointment(eventToAppointment(clickInfo.event));
        setIsOpen(true);
    }, []);

    const openForCreate = useCallback((selectInfo: DateSelectArg) => {
        setSelectedAppointment({
            startDate: dayjs(selectInfo.start),
            endDate: dayjs(selectInfo.end),
        } as Appointment);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setSelectedAppointment({} as Appointment);
    }, []);

    const save = useCallback(
        (appointment: CreateAdminAppointmentRequest) => {
            if (!appointment.id) {
                //TODO:remove businessID
                dispatch(createAppointmentThunk({
                    businessId: Number(businessId),
                    employeeId: appointment.employeeId ?? Number(fallbackEmployeeId),
                    appointment,
                }));
            } else {
                dispatch(updateAppointmentThunk({ businessId: Number(businessId), appointment }));
            }
        },
        [dispatch, businessId, fallbackEmployeeId]
    );

    const remove = useCallback(
        (appointmentId: number) => {
            if (appointmentId) {
                dispatch(deleteAppointmentThunk(appointmentId));
            }
        },
        [dispatch]
    );

    return { isOpen, selectedAppointment, openForEdit, openForCreate, close, save, remove };
}
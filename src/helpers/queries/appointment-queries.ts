import { AxiosResponse } from "axios";
import { API } from "../../utils/API";
import {
    Appointment,
    CreateAppointmentByGuestProps,
} from "../types/Appointment";

export type GetAppontmentBetweenProps = {
    startDate?: Date;
    endDate?: Date;
    employeeId: string;
};
export const getAppointmentsBetween = (params: GetAppontmentBetweenProps) => {
    return API.get("/api/appointments", { params: params });
};

export const createAppointmentQuery = (appointment: Appointment) => {
    return API.post("/api/appointments", appointment);
};

export const createAppointmentByBusinessAndEmployeeId = (
    businessId: number,
    employeeId: number,
    appointment: Appointment,
) => {
    return API.post(
        `/api/appointments/business/${businessId}/business-employee/${employeeId}/own`,
        appointment,
    );
};

export const patchAppointmentQuery = (
    businessId: number,
    appointment: Appointment,
) => {
    return API.patch(
        `/api/appointments/${appointment.id}/business/${businessId}`,
        appointment,
    );
};
//
type GetBusinessAvailableSlotsProps = {
    startDate: string;
    endDate: string;
    durationMinutes: number;
    employeeId: number;
};

export const getBusinessAvailableSlots = ({
    startDate,
    endDate,
    durationMinutes,
    employeeId,
}: GetBusinessAvailableSlotsProps) => {
    return API.get(
        `/api/appointments/employees/${employeeId}/available-slots`,
        {
            params: {
                startDate: startDate,
                endDate: endDate,
                durationMinutes: durationMinutes,
            },
        },
    );
};
//

export const deleteAppointmentQuery = (appointmentId: number) => {
    return API.post(`/api/appointments/${appointmentId}`);
};

export const createAppointmentByGuestQuery = (
    employeeId: number,
    formData: CreateAppointmentByGuestProps,
) => {
    return API.post(
        `/api/appointments/public/business-employee/${employeeId}`,
        formData,
    );
};

export const getAppointmentByModifierToken = (modifierToken: string) => {
    return API.get(`/api/appointments/cancel/${modifierToken}`);
};

export const cancelAppointmentByGuestWithToken = (modifierToken: string) => {
    return API.post(`/api/appointments/cancel/${modifierToken}`);
};

export const approveAppointmentById = (
    id: number,
    employeeId: number,
): Promise<AxiosResponse<Appointment>> => {
    return API.patch<Appointment>(
        `/api/appointments/${id}/business-employee/${employeeId}/approve`,
    );
};

export const cancelAppointmentById = (id: number, employeeId: number) => {
    return API.patch(
        `/api/appointments/${id}/business-employee/${employeeId}/cancel`,
    );
};

export const getPendingAppointments = (
    businessId: number,
): Promise<AxiosResponse<Appointment[]>> => {
    return API.get<Appointment[]>(
        `/api/appointments/business/${businessId}/pendings`,
    );
};

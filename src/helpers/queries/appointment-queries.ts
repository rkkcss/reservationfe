import { AxiosResponse } from "axios"
import { API } from "../../utils/API"
import { Appointment } from "../types/Appointment"

export type GetAppontmentBetweenProps = {
    startDate?: Date,
    endDate?: Date,
    businessId: number
}
export const getAppointmentsBetween = (params: GetAppontmentBetweenProps) => {
    return API.get("/api/appointments", { params: params })
}

export const createAppointmentQuery = (appointment: Appointment) => {
    return API.post("/api/appointments", appointment);
}

export const createAppointmentByOwnerQuery = (appointment: Appointment) => {
    return API.post("/api/appointments/create-by-owner", appointment);
}

export const patchAppointmentQuery = (appointment: Appointment) => {
    return API.patch(`/api/appointments/${appointment.id}`, appointment);
}
//
type GetBusinessAvailableSlotsProps = {
    businessId: number;
    startDate: string;
    endDate: string;
    durationMinutes: number;
    employeeId: number;
}

export const getBusinessAvailableSlots = ({ businessId, startDate, endDate, durationMinutes, employeeId }: GetBusinessAvailableSlotsProps) => {
    return API.get(`/api/appointments/businesses/${businessId}/employees/${employeeId}/available-slots`, {
        params: {
            startDate: startDate,
            endDate: endDate,
            durationMinutes: durationMinutes
        }
    });
}
//

export const deleteAppointmentQuery = (appointmentId: number) => {
    return API.post(`/api/appointments/${appointmentId}`);
}

// createAppointmentByGuestQuery create appointment by guest

type CreateAppointmentByGuestProps = {
    offeringId: number,
    date: Date | string,
    time: string,
    businessId: number,
    email: string,
    phoneNumber: string,
    name: string
}

export const createAppointmentByGuestQuery = (businessId: number, employeeId: number, formData: CreateAppointmentByGuestProps) => {
    return API.post(`/api/appointments/business/${businessId}/business-employee/${employeeId}`, formData);
}

export const getAppointmentByModifierToken = (modifierToken: string) => {
    return API.get(`/api/appointments/cancel/${modifierToken}`);
}

export const cancelAppointmentByGuestWithToken = (modifierToken: string) => {
    return API.post(`/api/appointments/cancel/${modifierToken}`)
}

export const approveAppointmentById = (id: number, employeeId: number): Promise<AxiosResponse<Appointment>> => {
    return API.patch<Appointment>(`/api/appointments/${id}/business-employee/${employeeId}/approve`);
};

export const cancelAppointmentById = (id: number, employeeId: number) => {
    return API.patch(`/api/appointments/${id}/business-employee/${employeeId}/cancel`)
}

export const getPendingAppointments = (businessId: number): Promise<AxiosResponse<Appointment[]>> => {
    return API.get<Appointment[]>(`/api/appointments/business/${businessId}/pendings`);
};

import { API } from "../../utils/API"
import { Appointment } from "../types/Appointment"

export type GetAppontmentBetweenProps = {
    startDate?: Date,
    endDate?: Date,
}
export const getAppointmentsBetween = (params: GetAppontmentBetweenProps) => {
    console.log(params)
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

export const getBusinessAvailableSlots = ({ businessId, startDate, endDate, durationMinutes }) => {
    return API.get(`/api/appointments/businesses/${businessId}/available-slots`, {
        params: {
            startDate: startDate,
            endDate: endDate,
            durationMinutes: durationMinutes
        }
    });
}

export const deleteAppointmentQuery = (appointmentId: number) => {
    return API.delete(`/api/appointments/${appointmentId}`);
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

export const createAppointmentByGuestQuery = (formData: CreateAppointmentByGuestProps) => {
    return API.post("/api/appointments", formData);
}

export const getAppointmentByModifierToken = (modifierToken: string) => {
    return API.get(`/api/appointments/cancel/${modifierToken}`);
}

export const cancelAppointmentByGuestWithToken = (modifierToken: string) => {
    return API.post(`/api/appointments/cancel/${modifierToken}`)
}

export const approveAppointmentById = (id: number) => {
    return API.patch(`/api/appointments/${id}/approve`)
}

export const cancelAppointmentById = (id: number) => {
    return API.patch(`/api/appointments/${id}/cancel`)
}
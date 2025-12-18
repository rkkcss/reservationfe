import { WorkingHours } from "./WorkingHours"

export type Business = {
    id: string | number | null,
    name?: string,
    description?: string,
    services?: string[],
    address?: string,
    phoneNumber?: string,
    openingHours?: WorkingHours[],
    breakBetweenAppointmentsMin?: number,
    appointmentApprovalRequired: boolean,
    logo: string,
    theme: string
}
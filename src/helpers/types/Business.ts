import { WorkingHours } from "./WorkingHours"

export type Business = {
    id?: string | number,
    name?: string,
    description?: string,
    services?: string[],
    address?: string,
    phoneNumber?: string,
    workingHours?: WorkingHours[],
    breakBetweenAppointmentsMin?: number,
    appointmentApprovalRequired: boolean,
    logo: string,
    theme: string
}
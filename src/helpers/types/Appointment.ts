import { Dayjs } from "dayjs"
import { Guest } from "./Guest"
import { Offering } from "./Offering"

export const APPOINTMENT_STATUSES = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED'
} as const;

export type AppointmentStatus =
    typeof APPOINTMENT_STATUSES[keyof typeof APPOINTMENT_STATUSES];

export type Appointment = {
    id: number | null;
    startDate?: Date | Dayjs | string;
    endDate?: Date | Dayjs | string;
    status: AppointmentStatus;
    note?: string;
    offering: Offering;
    guest?: Guest;
};
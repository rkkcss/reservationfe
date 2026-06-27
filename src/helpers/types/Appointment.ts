import { Dayjs } from "dayjs"
import { Guest } from "./Guest"
import { Offering } from "./Offering"
import { BusinessEmployee } from "./BusinessEmployee";

export const APPOINTMENT_STATUSES = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED'
} as const;

export type AppointmentStatus =
    typeof APPOINTMENT_STATUSES[keyof typeof APPOINTMENT_STATUSES];

export const APPOINTMENT_STATUSES_EXTENDED: Record<string, { label: string; color: string }> = {
    [APPOINTMENT_STATUSES.PENDING]: {
        label: "Elfogadásra vár",
        color: "gray",
    },
    [APPOINTMENT_STATUSES.CONFIRMED]: {
        label: "Elfogadva",
        color: "green",
    },
    [APPOINTMENT_STATUSES.CANCELLED]: {
        label: "Elutasítva",
        color: "red",
    },
} as const;

export type Appointment = {
    id: number | null;
    startDate?: Date | Dayjs | string;
    endDate?: Date | Dayjs | string;
    status: AppointmentStatus;
    note?: string;
    offering: Offering;
    guest?: Guest;
    businessEmployee: BusinessEmployee;
};

export type CreateAdminAppointmentRequest = Appointment & {
    employeeId: number;
}

export type CreateAppointmentByGuestProps = {
    offeringId: number,
    date: Dayjs | string,
    time: string,
    businessId: number,
    email: string,
    phoneNumber: string,
    name: string
    employeeId: number
}
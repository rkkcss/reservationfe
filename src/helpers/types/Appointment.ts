import { Dayjs } from "dayjs"
import { Guest } from "./Guest"
import { Offering } from "./Offering"

export type Appointment = {
    id?: number,
    startDate?: Date | Dayjs | string,
    endDate?: Date | Dayjs | string,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED',
    note?: string,
    offering: Offering,
    guest: Guest
}
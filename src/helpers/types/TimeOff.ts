import { Dayjs } from "dayjs";
import { BusinessEmployee } from "./BusinessEmployee";

export const TIME_OFF_TYPES = {
    VACATION: "VACATION",
    SICK_LEAVE: "SICK_LEAVE",
    OTHER: "OTHER",
} as const;

export type TimeOffType = keyof typeof TIME_OFF_TYPES;

export type TimeOff = {
    id: number | null;
    businessEmployee: BusinessEmployee;
    startDate: string; // "YYYY-MM-DD"
    endDate: string;
    startTime: string | null; // "HH:mm" vagy null, ha egész napos
    endTime: string | null;
    type: TimeOffType;
    note: string;
};

export type CreateTimeOffType = Omit<TimeOff, "businessEmployee"> & {
    businessEmployeeId: number;
};

export type CreateTimeOffFormType = {
    businessEmployee: number;
    isFullDay: boolean;
    dateRange: [Dayjs, Dayjs];
    timeRange?: [Dayjs | undefined, Dayjs | undefined] | null;
    type: TimeOffType;
    note?: string | null;
};

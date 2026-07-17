import dayjs from "dayjs";
import API from "../../utils/API";
import { CreateTimeOffType } from "../types/TimeOff";

export const getTimeOffsBetween = (params: {
    employeeId: string;
    startDate?: Date;
    endDate?: Date;
}) =>
    API.get(`/api/time-offs`, {
        params: {
            employeeId: params.employeeId,
            startDate: params.startDate
                ? dayjs(params.startDate).format("YYYY-MM-DD")
                : undefined,
            endDate: params.endDate
                ? dayjs(params.endDate).format("YYYY-MM-DD")
                : undefined,
        },
    });

export const createTimeOffQuery = (
    employeeId: number,
    timeOff: CreateTimeOffType,
) => {
    return API.post(`/api/time-offs/employee/${employeeId}`, timeOff);
};

export const patchTimeOffQuery = (timeOff: CreateTimeOffType) =>
    API.put(`/api/time-offs/${timeOff.id}`, timeOff);

export const deleteTimeOffQuery = (employeeId: number, timeOffId: number) =>
    API.delete(`/api/businesses/${employeeId}/time-offs/${timeOffId}`);

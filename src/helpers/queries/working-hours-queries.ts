import { API } from "../../utils/API"


export const getAllByBusinessOwner = (businessId: number) => {
    return API.get(`/api/working-hours/business/${businessId}/my`);
}

export const getWorkingHoursByBusinessEmployee = (businessId: number, employeeId: number) => {
    return API.get(`/api/working-hours/business/${businessId}/business-employee/${employeeId}`);
}
//
type WorkingHoursRequest = {
    startTime: string;
    endTime: string;
    id: number;
    dayOfWeek: number;
}

export const updateWorkingHours = (businessId: number, employeeId: number, workingHours: WorkingHoursRequest[]) => {
    return API.put(`/api/working-hours/business/${businessId}/business-employee/${employeeId}`, workingHours);
}
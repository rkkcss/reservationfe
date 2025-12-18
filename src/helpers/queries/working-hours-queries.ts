import { API } from "../../utils/API"
import { WorkingHours } from "../types/WorkingHours";


export const getAllByBusinessOwner = (businessId: number) => {
    return API.get(`/api/working-hours/business/${businessId}/my`);
}

export const updateWorkingHours = (businessId: number, employeeId: number, workingHours: WorkingHours[]) => {
    return API.put(`/api/working-hours/business/${businessId}/business-employee/${employeeId}`, workingHours);
}
import { API } from "../../utils/API"
import { WorkingHours } from "../types/WorkingHours";


export const getAllByBusinessOwner = () => {
    return API.get("/api/working-hours/business-owner");
}

export const updateWorkingHours = (workingHours: WorkingHours[]) => {
    return API.put("/api/working-hours/edit", workingHours);
}
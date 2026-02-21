import API from "../../utils/API"
import { WorkingHoursRequest } from "../types/WorkingHours";

export const getBusinessOpeningHoursByBusinessId = (businessId: number) => {
    return API.get(`/api/business-opening-hours/business/${businessId}`);
}

export const saveBusinessOpeningHoursByBusinessId = (businessId: number, openingHours: WorkingHoursRequest[]) => {
    return API.post(`/api/business-opening-hours/business/${businessId}`, openingHours);
}
import API from "../../utils/API";
import { BusinessEmployee } from "../types/BusinessEmployee";

export const getEmployeesByBusinessId = (businessId: number) => {
    return API.get<BusinessEmployee[]>(`/api/business-employee/business/${businessId}/employees`);

};

export const getCurrentBusinessEmployeeOptions = () => {
    return API.get("/api/business-employee/current");
}
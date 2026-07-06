import API from "../../utils/API";
import { BusinessEmployee } from "../types/BusinessEmployee";

export const getEmployeesByBusinessId = () => {
    return API.get<BusinessEmployee[]>(`/api/business-employee/employees`);
};

export const getCurrentBusinessEmployeeOptions = () => {
    return API.get("/api/business-employee/current");
}

export const changeBusinessEmployeeStatus = ({ employeeId, status }: { employeeId: number, status: boolean }) => {
    return API.patch(`/api/business-employee/${employeeId}/status`, status);
}

/*
 * Fetches all public business employees for TENANT
 * @returns {Promise<BusinessEmployee[]>} A promise that resolves with an array of business employees
 */
export const getPublicBusinessEmployees = () => {
    return API.get<BusinessEmployee[]>(`/api/business-employee/public`);
}
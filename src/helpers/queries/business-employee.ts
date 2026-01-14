import API from "../../utils/API";

export const getEmployeesByBusinessId = (businessId: number) => {
    return API.get(`/api/business-employee/business/${businessId}/employees`);

};

export const getCurrentBusinessEmployeeOptions = () => {
    return API.get("/api/business-employee/current");
}
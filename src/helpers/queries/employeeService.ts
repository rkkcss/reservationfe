import { API } from "../../utils/API"

export const getEmployeesByBusinessId = (businessId: number) => {
    return new Promise((resolve, reject) => {
        API.get(`/api/employees/business/${businessId}`)
            .then(res => resolve(res))
            .catch(err => reject(err));
    })
}

export const getAllEmployees = () => {
    return API.get(`/api/employees`);
}
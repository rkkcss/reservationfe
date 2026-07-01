import { AxiosResponse } from "axios";
import { API } from "../../utils/API";
import { Offering } from "../types/Offering";

export const getOffersByBusinessAndEmployeeId = (params?: { employeeId: number, search: string }): Promise<Offering[]> => {
    return API.get(`/api/offerings/business-employee/public`, { params: params })
        .then(res => {
            return res.data
        })
}

export const getOfferingByLoggedInEmployee = (): Promise<Offering[]> => {
    return API.get(`/api/offerings/business/employee`)
        .then(res => {
            return res.data
        })
}

export const updateOffer = (offer: Offering) => {
    return API.patch(`/api/offerings/${offer.id}`, offer);
}

export const createOffer = (offer: Offering, employeeId: number) => {
    return API.post(`/api/offerings/business/business-employee/${employeeId}`, offer);
}

export const deleteOffer = (offerId: number) => {
    return API.delete(`/api/offerings/${offerId}`);
}

/**
 * Fetches all offerings for a given business employee id
 * @param {number} businessEmployeeId - The id of the business employee
 * @returns {Promise<Offering[]>} A promise that resolves with an array of offerings
 */
export const getOfferingsByEmployeeId = async (businessEmployeeId: number): Promise<AxiosResponse<Offering[]>> => {
    const response = await API.get(`/api/offerings/business-employee/${businessEmployeeId}`);
    return response;
}
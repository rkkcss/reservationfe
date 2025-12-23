import { AxiosResponse } from "axios";
import { API } from "../../utils/API";
import { Offering } from "../types/Offering";

export const getOffersByBusinessId = (businessId: number | string): Promise<Offering[]> => {
    return API.get(`/api/offerings/business/${businessId}`)
        .then(res => {
            return res.data
        })
}

export const getOfferingByLoggedInEmployee = (businessId: number): Promise<Offering[]> => {
    return API.get(`/api/offerings/business/${businessId}/employee`)
        .then(res => {
            return res.data
        })
}

export const updateOffer = (offer: Offering, businessId: number) => {
    return API.patch(`/api/offerings/${offer.id}/business/${businessId}`, offer);
}

export const createOffer = (offer: Offering, businessId: number, employeeId: number) => {
    return API.post(`/api/offerings/business/${businessId}/business-employee/${employeeId}`, offer);
}

export const deleteOffer = (offerId: number, businessId: number) => {
    return API.patch(`/api/offerings/${offerId}/business/${businessId}`);
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
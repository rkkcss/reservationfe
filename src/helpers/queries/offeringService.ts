import { API } from "../../utils/API";
import { Offering } from "../types/Offering";
import { Pageable } from "../types/Pageable";

export const getOffersByBusinessId = (businessId: number | string): Promise<Pageable<Offering>> => {
    return API.get(`/api/offerings/business/${businessId}`)
        .then(res => {
            return res.data
        })
}

export const getOfferingByLoggedInBusiness = (): Promise<Offering[]> => {
    return API.get(`/api/offerings`)
        .then(res => {
            return res.data
        })
}

export const updateOffer = (offer: Offering) => {
    if (!offer.id) return
    return API.patch(`/api/offerings/${offer.id}`, offer);
}

export const createOffer = (offer: Offering) => {
    return API.post(`/api/offerings`, offer);
}

export const deleteOffer = (id: number) => {
    return API.delete(`/api/offerings/${id}`);
}
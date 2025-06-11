import { API } from "../../utils/API"
import { Business } from "../types/Business";

export const getBusiness = (id: number | string) => {
    return API.get(`/api/businesses/${id}`);
}

export const getBusinessByLoggedInUser = () => {
    return API.get("/api/businesses/owner");
}

export const patchBusiness = (business: Business) => {
    return API.patch(`/api/businesses/${business.id}`, business);
}
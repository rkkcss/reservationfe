import { API } from "../../utils/API"
import { Business } from "../types/Business";

const DEFAULT_PATH = "/api/businesses"

export const getBusiness = (id: number | string) => {
    return API.get(`${DEFAULT_PATH}/${id}`);
}

export const getBusinessByLoggedInUser = (businessId: number) => {
    return API.get(`${DEFAULT_PATH}/${businessId}/private`);
}

export const patchBusiness = (business: Business) => {
    return API.patch(`${DEFAULT_PATH}/${business.id}`, business);
}


type ChangeBusinessLogoType = {
    logo: string
}

export const changeBusinessLogo = (data: ChangeBusinessLogoType) => {
    return API.post(`${DEFAULT_PATH}/logo`, data);
}

type ChangeBusinessThemeType = {
    theme: string
}

export const changeBusinessTheme = (data: ChangeBusinessThemeType) => {
    return API.post(`${DEFAULT_PATH}/theme`, data);
}
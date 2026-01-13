import { AxiosRequestConfig } from "axios";
import API from "../../utils/API"
import { BusinessRating } from "../types/BusinessRating";

export const getBusinessRatingsQuery = (businessId: number, params?: AxiosRequestConfig['params']) => {
    return API.get<BusinessRating[]>(`/api/business-ratings/business/${businessId}`, { params: params });
}
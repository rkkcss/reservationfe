import { AxiosRequestConfig } from "axios";
import API from "../../utils/API"
import { BusinessRatingSummary } from "../types/BusinessRating";

export const getBusinessRatingsQuery = (businessId: number, params?: AxiosRequestConfig['params']) => {
    return API.get<BusinessRatingSummary>(`/api/business-ratings/business/${businessId}`, { params: params });
}
import { AxiosRequestConfig } from "axios";
import API from "../../utils/API"
import { BusinessRatingSummary } from "../types/BusinessRating";

export const getBusinessRatingsQuery = (params?: AxiosRequestConfig['params']) => {
    return API.get<BusinessRatingSummary>(`/api/business-ratings/business`, { params: params });
}
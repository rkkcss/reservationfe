import { API } from "../../utils/API"

export const getBusiness = (id: number | string) => {
    return API.get(`/api/businesses/${id}`);
}
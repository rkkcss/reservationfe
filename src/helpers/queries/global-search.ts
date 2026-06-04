import API from "../../utils/API"

export const getGlobalSearch = (businessId: number, query: string) => {
    return API.get(`/api/global-search/${businessId}/?q=${query}`)
}
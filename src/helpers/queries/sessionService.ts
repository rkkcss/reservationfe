import { API } from "../../utils/API"

export const getSessionQuery = () => {
    return API.get("/api/account/sessions");
}
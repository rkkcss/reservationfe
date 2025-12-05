import { API } from "../../utils/API";
import { ChangeUserName } from "../types/ChangeUserName";

export const fetchCsrfToken = () => {
    return API.get("/api/csrf-token");
}

export const patchUserName = (userNames: ChangeUserName) => {
    return API.patch("/api/change-name", userNames);
}

export const patchUserLogin = (login: string) => {
    return API.patch("/api/change-login", login);
}
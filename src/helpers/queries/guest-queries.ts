import { API } from "../../utils/API"
import { Guest } from "../types/Guest";


export const getAllGuestsBySearch = (params: string) => {
    return API.get("/api/guests/search", { params: { searchString: params } });
}

export const getAllGuestsByLoggedInUser = (params?: string) => {
    return API.get("/api/guests", { params });
}

export const patchGuest = (guest: Guest) => {
    return API.patch(`/api/guests/${guest.id}`, guest);
}

export const createQuest = (guest: Guest) => {
    return API.post("/api/guests", guest);
}
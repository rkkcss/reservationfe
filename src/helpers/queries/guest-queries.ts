import { API } from "../../utils/API";
import { Appointment } from "../types/Appointment";
import { Guest, GuestStatistics } from "../types/Guest";

export const getAllGuestsBySearch = (businessId: number, params: string) => {
    return API.get(`/api/guests/business/${businessId}/search`, {
        params: { searchString: params },
    });
};

export const getAllGuestsByLoggedInUser = (params?: string) => {
    return API.get("/api/guests", { params });
};

export const patchGuest = (guest: Guest) => {
    return API.patch(`/api/guests/${guest.id}`, guest);
};

export const createQuest = (guest: Guest) => {
    return API.post(`/api/guests`, guest);
};

export const getGuestByGuestId = (guestId: number) => {
    return API.get(`/api/guests/${guestId}`);
};

export const getGuestStatisticsById = (guestId: number) => {
    return API.get<GuestStatistics>(`/api/guests/${guestId}/statistics`);
};

export const getGuestNextAppointmentById = (guestId: number) => {
    return API.get<Appointment>(`/api/guests/${guestId}/next-appointment`);
};

import API from "../../utils/API"
import { UserWithPassword } from "../types/User";


export const getAllBusinessEmployeeInvitesQuery = (businessId: number) => {
    return API.get(`/api/employee-invite/business/${businessId}/pending`);
}

export const getActivateBusinessEmployeeInviteQuery = (inviteToken: string) => {
    return API.get(`/api/employee-invite/activate`, {
        params: {
            token: inviteToken
        }
    });
};

export const activateBusinessEmployeeInvite = (inviteToken: string, data: UserWithPassword) => {
    return API.post(`/api/employee-invite/activate`, data, {
        params: {
            token: inviteToken
        }
    });
}
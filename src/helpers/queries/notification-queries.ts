import API from "../../utils/API";

export const putNotificationRead = (id: number, businessEmployeeId: number) => {
    return API.put(`/api/notifications/${id}/read`, {}, { params: { businessEmployeeId } });
}
import { API } from "../../utils/API";
import { ChangeUserName } from "../types/ChangeUserName";

export const fetchCsrfToken = () => {
    return API.get("/api/csrf-token");
};

export const patchUserName = (userNames: ChangeUserName) => {
    return API.patch("/api/change-name", userNames);
};

export const patchUserLogin = (login: string) => {
    return API.patch("/api/change-login", login);
};

export const increaseOnboardingVersion = () => {
    return API.patch("/api/account/tutorial/done");
};

export const changePassword = ({
    currentPassword,
    newPassword,
}: {
    currentPassword: string;
    newPassword: string;
}) => {
    return API.post("/api/account/change-password", {
        currentPassword,
        newPassword,
    });
};
//reseting password 1st step
export const passwordResetRequest = (email: string) => {
    return API.post("/api/account/reset-password/init", email, {
        headers: {
            "Content-Type": "text/plain",
        },
        transformRequest: [(data) => data],
    });
};

//reseting password 2nd step
export const passwordResetWithKey = ({
    key,
    newPassword,
}: {
    key: string;
    newPassword: string;
}) => {
    return API.post("/api/account/reset-password/finish", { key, newPassword });
};

export const patchAccountProfileImage = (data: FormData) => {
    return API.patch("/api/account/profile-image", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

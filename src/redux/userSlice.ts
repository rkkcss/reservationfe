import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../utils/API";
import { APILogin } from "../utils/APILogin";
import i18next from "i18next";
import { AxiosError } from "axios";
import { BusinessEmployee } from "../helpers/types/BusinessEmployee";
import { notificationManager } from "../utils/notificationConfig";
import { User } from "../helpers/types/User";


export type LoginForm = {
    username: string;
    password: string;
    rememberMe: string;
};

export type State = {
    user: User | null;
    loading: boolean;
    error: boolean;
    msg: string | null;
    theme: string;
    selectedBusinessEmployee: BusinessEmployee | null;
};

const initialState: State = {
    user: null,
    loading: false,
    error: false,
    msg: "",
    theme: "light",
    selectedBusinessEmployee: null,
};

export const getAccountInfo = createAsyncThunk<User>(
    "getAccountInfo",
    async () => {
        const response = await API.get<User>("/api/account");
        return response.data;
    }
);

export const getAccountBusinessOptions = createAsyncThunk(
    "getAccountBusinessOptions",
    async () => {
        const response = await API.get("/api/business-employee/current");
        return response.data;
    }
);

export const loginUser = createAsyncThunk<
    { status: number; message: string },
    LoginForm
>(
    'loginUser',
    async (user, { dispatch, rejectWithValue }) => {
        try {
            const res = await APILogin.post('/api/authentication', user);

            if (res.status === 200) {
                await dispatch(getAccountInfo()).unwrap();
                return { status: res.status, message: i18next.t("login-modal:loggedInSuccessfully") };
            }

            return { status: res.status, message: "Unexpected status code!" };
        } catch (error: unknown) {
            const err = error as AxiosError;
            const status = err.response?.status ?? 0;

            if (status === 401) {
                // rejectWithValue használata, ha hiba történt
                return rejectWithValue({ status, message: i18next.t("login-modal:wrongCredentials") });
            }

            return rejectWithValue({ status, message: i18next.t("login-modal:somethingWentWrong") });
        }
    }
);

export const logoutUser = createAsyncThunk("logoutUser", async () => {
    await API.post("/api/logout", {}, {
        showSuccessNotification: false
    });
    await API.get("/api/csrf-token");
});

export const updateUserApi = createAsyncThunk<User, User>(
    "updateUser",
    async (user: User) => {
        await API.post("/api/account", user);
        return user;
    }
);

export const updateUserImg = createAsyncThunk("updateUserImg", async (imageUrl: string, { dispatch }) => {
    await API.post("/api/account/change-image", { imageUrl: imageUrl });
    dispatch(setImageUrl(imageUrl));
})

const loginSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        loadingTrue(state) {
            state.loading = true;
        },
        loadingFalse(state) {
            state.loading = false;
        },
        toggleTheme(state, action: PayloadAction<string>) {
            state.theme = action.payload;
        },
        setActiveBusinessEmployee(state, action: PayloadAction<BusinessEmployee>) {
            state.selectedBusinessEmployee = action.payload;
        },
        setActiveBusinessEmployeeNull(state) {
            state.selectedBusinessEmployee = null;
        },
        setImageUrl(state, action) {
            if (state.user) {
                state.user = ({ ...state.user, imageUrl: action.payload })
            }
        },
        updateName(state, action) {
            if (state.user) {
                state.user = ({ ...state.user, firstName: action.payload.firstName, lastName: action.payload.lastName });
            }

        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
                state.msg = "";
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(getAccountInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAccountInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getAccountInfo.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.selectedBusinessEmployee = null;
                notificationManager.success("success-logout", {
                    message: i18next.t("login-modal:logoutSuccessfully"),
                });
            })
            .addCase(logoutUser.rejected, (state: State, action) => {
                state.loading = false;
                state.user = null;
                console.log(action);
            })
            .addCase(updateUserApi.rejected, (state: State) => {
                console.log("updateerror", state);
            });
    },
});

export const { loadingTrue, loadingFalse, toggleTheme, setImageUrl, updateName, setActiveBusinessEmployee, setActiveBusinessEmployeeNull } = loginSlice.actions;

export default loginSlice.reducer;
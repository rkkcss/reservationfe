import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../utils/API";
import { APILogin } from "../utils/APILogin";
import i18next from "i18next";
import { message } from "antd";
import { Authorities } from "../helpers/types/Authorities";
import { AxiosError } from "axios";


export type User = {
    id: number;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl?: string | "";
    activated: boolean;
    langKey: string;
    createdDate: Date;
    authorities: [Authorities];
};

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
};

const initialState: State = {
    user: null,
    loading: false,
    error: false,
    msg: "",
    theme: "light",
};

export const getAccountInfo = createAsyncThunk<User>(
    "getAccountInfo",
    async () => {
        const response = await API.get<User>("/api/account");
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
                dispatch(getAccountInfo());
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
    await API.post("/api/logout");
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
                message.success(i18next.t("login-modal:logoutSuccessfully"));
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

export const { loadingTrue, loadingFalse, toggleTheme, setImageUrl, updateName } = loginSlice.actions;

export default loginSlice.reducer;
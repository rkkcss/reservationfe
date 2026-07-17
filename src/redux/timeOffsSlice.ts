import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { notification } from "antd";
import { logoutUser, setActiveBusinessEmployeeDefault } from "./userSlice";
import {
    createTimeOffQuery,
    deleteTimeOffQuery,
    getTimeOffsBetween,
    patchTimeOffQuery,
} from "../helpers/queries/timeoff-queries";
import { CreateTimeOffType, TimeOff } from "../helpers/types/TimeOff";

export type TimeOffsState = {
    timeOffs: TimeOff[];
    loading: boolean;
};

const initialState: TimeOffsState = {
    timeOffs: [],
    loading: false,
};

export const fetchTimeOffsBetween = createAsyncThunk<
    TimeOff[],
    {
        employeeId: string;
        startDate?: Date;
        endDate?: Date;
    }
>("timeOffs/fetchTimeOffsBetween", async (params) => {
    const response = await getTimeOffsBetween(params);
    return response.data;
});

type CreateTimeOffArgs = {
    employeeId: number;
    timeOff: CreateTimeOffType;
};

export const createTimeOffThunk = createAsyncThunk<TimeOff, CreateTimeOffArgs>(
    "timeOffs/createTimeOffThunk",
    async ({ employeeId, timeOff }, { rejectWithValue }) => {
        if (timeOff.id) return rejectWithValue("Can't have ID");
        const result = await createTimeOffQuery(employeeId, timeOff);
        return result.data;
    },
);

import axios from "axios";

export const updateTimeOffThunk = createAsyncThunk<
    TimeOff,
    { timeOff: CreateTimeOffType },
    { rejectValue: string }
>("timeOffs/updateTimeOff", async ({ timeOff }, { rejectWithValue }) => {
    if (!timeOff.id) return rejectWithValue("Invalid time off ID");

    try {
        const result = await patchTimeOffQuery(timeOff);
        return result.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const serverMessage = error.response?.data?.message;

            if (typeof serverMessage === "string") {
                return rejectWithValue(serverMessage);
            }
        }
        return rejectWithValue(
            error instanceof Error ? error.message : "Ismeretlen hiba",
        );
    }
});

export const deleteTimeOffThunk = createAsyncThunk<
    number,
    { employeeId: number; timeOffId: number }
>(
    "timeOffs/deleteTimeOffThunk",
    async ({ employeeId, timeOffId }, { rejectWithValue }) => {
        if (!timeOffId) return rejectWithValue("ID can't be null!");
        await deleteTimeOffQuery(employeeId, timeOffId);
        return timeOffId;
    },
);

const timeOffsSlice = createSlice({
    name: "timeOffs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTimeOffsBetween.fulfilled, (state, action) => {
                state.timeOffs = action.payload;
                state.loading = false;
            })
            .addCase(fetchTimeOffsBetween.rejected, (state) => {
                notification.error({
                    message: "Hiba a szabadságok lekérésekor!",
                    placement: "bottom",
                });
                state.loading = false;
            })
            .addCase(fetchTimeOffsBetween.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                createTimeOffThunk.fulfilled,
                (state, action: PayloadAction<TimeOff>) => {
                    state.timeOffs.push(action.payload);
                },
            )
            .addCase(createTimeOffThunk.rejected, () => {
                notification.error({
                    message: "Hiba a szabadság létrehozásakor!",
                    placement: "bottom",
                });
            })
            .addCase(
                updateTimeOffThunk.fulfilled,
                (state, action: PayloadAction<TimeOff>) => {
                    const index = state.timeOffs.findIndex(
                        (timeOff) => timeOff.id === action.payload.id,
                    );
                    if (index !== -1) {
                        state.timeOffs[index] = action.payload;
                    }
                },
            )
            .addCase(updateTimeOffThunk.rejected, (_state, action) => {
                if (action.payload === "timeoff.overlap") {
                    notification.error({
                        message:
                            "Ebben az időszakban már van rögzített szabadság!",
                        placement: "bottom",
                    });
                } else {
                    notification.error({
                        message: "Hiba a szabadság módosításakor!",
                        placement: "bottom",
                    });
                }
            })
            .addCase(
                deleteTimeOffThunk.fulfilled,
                (state, action: PayloadAction<number>) => {
                    state.timeOffs = state.timeOffs.filter(
                        (timeOff) => timeOff.id !== action.payload,
                    );
                },
            )
            .addCase(logoutUser.fulfilled, (state) => {
                state.timeOffs = [];
            })
            .addCase(setActiveBusinessEmployeeDefault, (state) => {
                state.timeOffs = [];
            });
    },
});

export default timeOffsSlice.reducer;

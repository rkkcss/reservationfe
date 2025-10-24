import { createSlice } from '@reduxjs/toolkit';

export type GeneralState = {
    theme: string,
    isCalendarAlertOpen: boolean
};

const initialState: GeneralState = {
    theme: 'light',
    isCalendarAlertOpen: false,
};

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        openCalendarAlert: (state) => {
            state.isCalendarAlertOpen = true;
        },
        closeCalendarAlert: (state) => {
            state.isCalendarAlertOpen = false;
        }
    }
});

export const { openCalendarAlert, closeCalendarAlert } = generalSlice.actions;
export default generalSlice.reducer;
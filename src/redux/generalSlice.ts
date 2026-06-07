import { createSlice } from '@reduxjs/toolkit';

export type GeneralState = {
    theme: string,
    isCalendarAlertOpen: boolean,
    isLeftMenuCollapsed: boolean
};

const initialState: GeneralState = {
    theme: 'light',
    isCalendarAlertOpen: false,
    isLeftMenuCollapsed: false
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
        },
        toggleLeftMenu: (state) => {
            state.isLeftMenuCollapsed = !state.isLeftMenuCollapsed;
        }
    }
});

export const { openCalendarAlert, closeCalendarAlert, toggleLeftMenu } = generalSlice.actions;
export default generalSlice.reducer;
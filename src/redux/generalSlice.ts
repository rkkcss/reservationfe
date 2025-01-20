import { createSlice } from '@reduxjs/toolkit';

export type GeneralState = {
    theme: string,
    isLoginModalOpen: boolean
};

const initialState: GeneralState = {
    theme: 'light',
    isLoginModalOpen: false,
};

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        openLoginModal: (state) => {
            state.isLoginModalOpen = true;
        },
        closeLoginModal: (state) => {
            state.isLoginModalOpen = false;
        }
    }
});

export const { openLoginModal, closeLoginModal } = generalSlice.actions;
export default generalSlice.reducer;
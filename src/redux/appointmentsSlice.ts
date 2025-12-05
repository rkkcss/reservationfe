import {
    getAppointmentsBetween,
    getPendingAppointments,
    approveAppointmentById,
    cancelAppointmentById,
    patchAppointmentQuery,
    createAppointmentByOwnerQuery,
    deleteAppointmentQuery
} from '../helpers/queries/appointment-queries';
import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, APPOINTMENT_STATUSES } from '../helpers/types/Appointment';
import { notification } from 'antd';
import dayjs from 'dayjs';
import { UserStore } from '../store/store';

export type AppointmentsState = {
    pendingAppointments: Appointment[],
    appointments: Appointment[],
    loading: boolean,
};

const initialState: AppointmentsState = {
    pendingAppointments: [],
    appointments: [],
    loading: false,
};

export const fetchAppointmentsBetween = createAsyncThunk<
    Appointment[],
    { startDate?: Date, endDate?: Date, businessId: number }
>('appointments/fetchAppointmentsBetween', async (params) => {
    const response = await getAppointmentsBetween(params);
    return response.data;
});


// Async thunk to fetch pending appointments
export const fetchPendingAppointments = createAsyncThunk<
    Appointment[],
    void,
    { state: UserStore }
>(
    'appointments/getPendingAppointments',
    async (_, thunkAPI) => {

        const state = thunkAPI.getState();
        const businessId = state.userStore.selectedBusinessEmployee?.business.id
        //need better handling
        if (!businessId) return [];

        const response = await getPendingAppointments(Number(businessId));

        return response.data;
    }
);

export const approvePendingAppointmentByIdThunk = createAsyncThunk<Appointment, number | null>(
    'appointments/approvePendingAppointmentById',
    async (appointmentId, { rejectWithValue }) => {
        if (!appointmentId) return rejectWithValue("Invalid appointment ID");

        const result = await approveAppointmentById(appointmentId);
        return result.data;
    });

export const cancelPendingAppointmentByIdThunk = createAsyncThunk<Appointment, number | null>(
    'appointments/cancelPendingAppointmentById',
    async (appointmentId, { rejectWithValue }) => {
        // Implementation for canceling a pending appointment
        if (!appointmentId) return rejectWithValue("Invalid appointment ID");

        const result = await cancelAppointmentById(appointmentId);
        return result.data;
    }
);

export const updateAppointmentThunk = createAsyncThunk<Appointment, Appointment>(
    'appointments/updateAppointment',
    async (appointment, { rejectWithValue }) => {
        // Implementation for updating an appointment
        if (!appointment.id) return rejectWithValue("Invalid appointment ID");
        const result = await patchAppointmentQuery(appointment);
        return result.data;
    }
);

export const createAppointmentThunk = createAsyncThunk<Appointment, Appointment>(
    'appointments/createAppointmentThunk',
    async (appointment, { rejectWithValue }) => {
        if (appointment.id) return rejectWithValue("Can't have ID");
        const result = await createAppointmentByOwnerQuery(appointment);
        return result.data;
    }
);

export const deleteAppointmentThunk = createAsyncThunk<number, number>(
    'appointment/deleteAppointmentThunk',
    async (appointmentId, { rejectWithValue }) => {
        if (!appointmentId) return rejectWithValue("ID can't be null!");
        await deleteAppointmentQuery(appointmentId);
        return appointmentId;
    }
)


const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingAppointments.fulfilled, (state, action) => {
                state.pendingAppointments = action.payload;
                state.loading = false;
            })
            .addCase(fetchPendingAppointments.rejected, (state) => {
                notification.error({ message: "Hiba a függőben lévő időpontok lekérésekor!", placement: "bottom" });
                state.loading = false;
            })
            .addCase(fetchPendingAppointments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAppointmentsBetween.fulfilled, (state, action) => {
                state.appointments = action.payload;
            })
            .addCase(createAppointmentThunk.fulfilled, (state, action: PayloadAction<Appointment>) => {
                state.appointments.push(action.payload);
                if (action.payload.status === APPOINTMENT_STATUSES.PENDING) {
                    state.pendingAppointments.push(action.payload);
                }
            })
            // Update appointment
            .addCase(updateAppointmentThunk.fulfilled, (state, action: PayloadAction<Appointment>) => {
                const index = state.appointments.findIndex(
                    (appointment) => appointment.id === action.payload.id
                );

                if (index !== -1) {
                    state.appointments[index] = action.payload;

                    const isPending = action.payload.status === APPOINTMENT_STATUSES.PENDING;
                    const isFutureAppointment = dayjs(action.payload.startDate).isAfter(dayjs());
                    const alreadyPending = state.pendingAppointments.some(
                        (appointment) => appointment.id === action.payload.id
                    );

                    if (isPending && isFutureAppointment && !alreadyPending) {
                        state.pendingAppointments.push(action.payload);
                    }

                    else if ((!isPending || !isFutureAppointment) && alreadyPending) {
                        state.pendingAppointments = state.pendingAppointments.filter(
                            (appointment) => appointment.id !== action.payload.id
                        );
                    }
                }
            })
            //after delete 
            .addCase(deleteAppointmentThunk.fulfilled, (state, action: PayloadAction<number>) => {
                console.log(action)
                state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
                state.pendingAppointments = state.pendingAppointments.filter(appointment => appointment.id !== action.payload);
            })
            .addMatcher(
                isAnyOf(
                    approvePendingAppointmentByIdThunk.fulfilled,
                    cancelPendingAppointmentByIdThunk.fulfilled
                ),
                (state, action: PayloadAction<Appointment>) => {
                    // Remove from pendingAppointments
                    state.pendingAppointments = state.pendingAppointments
                        .filter(appointment => appointment.id !== action.payload.id);

                    // Update in appointments
                    const index = state.appointments.findIndex(
                        (appointment) => appointment.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.appointments[index] = action.payload;
                    }
                }
            )
    }
});

export const asd = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
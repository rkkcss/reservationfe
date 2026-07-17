import { configureStore } from "@reduxjs/toolkit";
import loginSliceReducer from "../redux/userSlice";
import generalSliceReducer from "../redux/generalSlice";
import appointmentsSliceReducer from "../redux/appointmentsSlice";
import timeOffSliceReducer from "../redux/timeOffsSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const loginPersistConfig = {
    key: "login",
    storage,
    blacklist: ["error"],
};

const generalPersistConfig = {
    key: "general",
    storage,
    blacklist: ["error"],
};

const appointmentPersistConfig = {
    key: "appointments",
    storage,
    blacklist: ["error"],
};

const timeOffPersistConfig = {
    key: "timeOffs",
    storage,
    blacklist: ["error"],
};

const persistedLoginReducer = persistReducer(
    loginPersistConfig,
    loginSliceReducer,
);
const persistedGeneralReducer = persistReducer(
    generalPersistConfig,
    generalSliceReducer,
);
const persistedAppointmentsReducer = persistReducer(
    appointmentPersistConfig,
    appointmentsSliceReducer,
);
const persistedTimeOffReducer = persistReducer(
    timeOffPersistConfig,
    timeOffSliceReducer,
);

const store = configureStore({
    reducer: {
        userStore: persistedLoginReducer,
        generalStore: persistedGeneralReducer,
        appointmentStore: persistedAppointmentsReducer,
        timeOffStore: persistedTimeOffReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

const persistor = persistStore(store);

export { persistor };
export default store;

export type UserStore = ReturnType<typeof store.getState>;
export type GeneralStore = ReturnType<typeof store.getState>;
export type AppointmentStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

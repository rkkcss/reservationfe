import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type store from './store'; // vagy '../store' ha máshonnan importálsz

// Ezeket a típusokat a store-ból kell kinyerni
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hookok típusos használathoz
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export const RequireOnboardingComplete = () => {
    const { selectedBusinessEmployee, user } = useAppSelector(
        (state) => state.userStore,
    );

    if (!selectedBusinessEmployee) {
        return <Navigate to="/choose-business" replace />;
    }

    const business = selectedBusinessEmployee?.business;
    const ownerId = business?.owner?.id;
    const userId = user?.id;

    if (!ownerId || !userId) {
        return <Navigate to="/choose-business" replace />;
    }

    const isOwner = String(ownerId) === String(userId);
    const onboardingIncomplete = !business?.onboardingCompleted; // falsy check, nem szigorú === false

    if (isOwner && onboardingIncomplete) {
        return <Navigate to="/complete-onboarding" replace />;
    }

    return <Outlet />;
};

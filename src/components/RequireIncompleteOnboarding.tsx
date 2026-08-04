import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";

// RequireIncompleteOnboarding.tsx
export const RequireIncompleteOnboarding = () => {
    const { selectedBusinessEmployee, user } = useAppSelector(
        (state) => state.userStore,
    );

    const business = selectedBusinessEmployee?.business;
    const ownerId = business?.owner?.id;
    const userId = user?.id;

    const hasValidOwnerData = Boolean(ownerId && userId);
    const isOwner = hasValidOwnerData && String(ownerId) === String(userId);
    const onboardingIncomplete = !business?.onboardingCompleted;

    if (!selectedBusinessEmployee)
        return <Navigate to="/choose-business" replace />;
    if (!hasValidOwnerData) return <Navigate to="/choose-business" replace />;
    if (!isOwner || !onboardingIncomplete)
        return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};

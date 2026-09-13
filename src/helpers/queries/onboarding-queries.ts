import API from "../../utils/API";
import { Business } from "../types/Business";
import { BusinessEmployee } from "../types/BusinessEmployee";
import { OnboardingStatus } from "../types/OnBoardingStepType";
import { WorkingHoursRequest } from "../types/WorkingHours";

export const getBusinessOnboardingStepQuery = () => {
    return API.get<OnboardingStatus>("/api/onboarding/step");
};

export const onboardingThemeStepPostQuery = (data: string) => {
    return API.post("/api/onboarding/step/theme", data);
};

export const onboardingDetailsStepPostQuery = (data: Business) => {
    return API.post<{ business: Business; businessEmployee: BusinessEmployee }>(
        "/api/onboarding/step/details",
        data,
    );
};

export const onboardingWorkingHoursQuery = (data: WorkingHoursRequest[]) => {
    return API.post("/api/onboarding/step/working-hours", data);
};

export const uploadOnboardingImagesQuery = (data: FormData) => {
    return API.post("/api/onboarding/step/images", data);
};

export const onboardingSkipStep = () => {
    return API.post<Business>("/api/onboarding/step/skip");
};

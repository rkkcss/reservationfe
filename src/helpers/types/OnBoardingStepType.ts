export enum OnboardingStatus {
    BUSINESS_DETAILS = "BUSINESS_DETAILS",
    BUSINESS_THEME = "BUSINESS_THEME",
    BUSINESS_IMAGES = "BUSINESS_IMAGES",
    WORKING_HOURS = "WORKING_HOURS",
    COMPLETED = "COMPLETED",
}

export const ONBOARDING_STEPS: Record<OnboardingStatus, number> = {
    [OnboardingStatus.BUSINESS_DETAILS]: 0,
    [OnboardingStatus.BUSINESS_THEME]: 1,
    [OnboardingStatus.WORKING_HOURS]: 2,
    [OnboardingStatus.BUSINESS_IMAGES]: 3,
    [OnboardingStatus.COMPLETED]: 4,
};

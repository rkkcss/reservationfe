import { OnboardingStatus } from "./OnBoardingStepType";
import { User } from "./User";
import { WorkingHours } from "./WorkingHours";

export type Business = {
    id: string | number | null;
    name: string;
    description?: string;
    address?: string;
    phoneNumber?: string;
    openingHours: WorkingHours[];
    breakBetweenAppointmentsMin?: number;
    appointmentApprovalRequired: boolean;
    logo: string;
    theme: string;
    onboardingCompleted: boolean;
    onboardingStep: OnboardingStatus;
    owner: User;
    bannerUrl: string;
    bannerPublicId: string;
};

export type OnboardingFinishType = {
    business: Business;
};

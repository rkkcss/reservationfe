import { Button, Spin, Steps } from "antd";
import { useEffect, useState } from "react";
import StepBusinessInfo from "./StepBusinessInfo/StepBusinessInfo";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useAppDispatch } from "../../store/hooks";
import {
    setActiveBusinessEmployeeDefault,
    updateBusinessInSelectedEmployee,
} from "../../redux/userSlice";
import { ONBOARDING_STEPS } from "../../helpers/types/OnBoardingStepType";
import OnboardingThemeSelector from "./StepThemeSelector/OnboardingThemeSelector";
import {
    getBusinessOnboardingStepQuery,
    onboardingSkipStep,
} from "../../helpers/queries/onboarding-queries";
import Loading from "../../components/Loading";
import OnboardingWorkinghours from "./StepWorkingHours/OnboardingWorkinghours";
import OnboardingBannerAndLogo from "./StepUploadingBannerAndLogo/OnboardingBannerAndLogo";
import { useNavigate } from "react-router";

const CompleteOnboardingPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(
        ONBOARDING_STEPS.BUSINESS_DETAILS,
    );
    const next = () => {
        setCurrentStep((prev) => prev + 1);
    };
    //const prev = () => setCurrentStep((prev) => prev - 1);

    const skip = () => {
        onboardingSkipStep().then((res) => {
            if (res.status === 200) {
                if (res.data.onboardingCompleted) {
                    dispatch(updateBusinessInSelectedEmployee(res.data));

                    navigate("/dashboard", { replace: true });
                    return;
                }

                next();
            }
        });
    };

    useEffect(() => {
        getBusinessOnboardingStepQuery()
            .then((res) => {
                setCurrentStep(ONBOARDING_STEPS[res.data]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleGoBack = () => {
        dispatch(setActiveBusinessEmployeeDefault());
        navigate("/choose-business");
    };

    const items = [
        {
            title: "Üzlet információk",
            content: (
                <StepBusinessInfo onNext={next} onLoadingChange={setLoading} />
            ),
        },
        {
            title: "Kinézet",
            content: (
                <OnboardingThemeSelector
                    onNext={next}
                    onLoadingChange={setLoading}
                    onSkip={skip}
                />
            ),
        },
        {
            title: "Munkaidő",
            content: <OnboardingWorkinghours onSkip={skip} onNext={next} />,
        },
        {
            title: "Logó és boritó",
            content: <OnboardingBannerAndLogo onSkip={skip} />,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 min-h-dvh">
            <Spin spinning={loading} indicator={<Loading size={30} />}>
                <Steps
                    className="pt-12 pb-12 max-w-2xl mx-auto"
                    current={currentStep}
                    items={items.map((item) => ({ title: item.title }))}
                />
                <Button
                    variant="link"
                    type="link"
                    icon={<FaArrowLeft />}
                    onClick={() => handleGoBack()}
                >
                    Vissza
                </Button>
                <div className="flex">
                    <div className="hidden lg:flex flex-col max-w-lg justify-center items-center text-center gap-4">
                        <FaCheckCircle className="size-16 text-green-600" />
                        <p className="text-5xl font-semibold">Mindjárt kész!</p>
                        <p className="text-xl">
                            Már csak néhány lépés a testreszabásból, hogy
                            könnyebben megtaláljanak az ügyfeleid.
                        </p>
                    </div>
                    <div className="flex-1">{items[currentStep]?.content}</div>
                </div>
            </Spin>
        </div>
    );
};

export default CompleteOnboardingPage;

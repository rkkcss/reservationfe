import { Button, Form, Steps } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import StepBusinessInfo from "./StepBusinessInfo/StepBusinessInfo";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useAppDispatch } from "../../store/hooks";
import {
    finishBusinessOnboarding,
    setActiveBusinessEmployeeDefault,
} from "../../redux/userSlice";
import { postOnboardingFinishQuery } from "../../helpers/queries/business-queries";
import { Business } from "../../helpers/types/Business";
import { useNavigate } from "react-router";

const CompleteOnboardingPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = useForm();
    const next = () => setCurrentStep((prev) => prev + 1);
    //const prev = () => setCurrentStep((prev) => prev - 1);

    const handleFinish = (values: Business) => {
        console.log(values);
        const resultData = {
            business: values,
        };
        postOnboardingFinishQuery(resultData).then((res) => {
            if (res.status === 200) {
                dispatch(finishBusinessOnboarding());
                navigate("/calendar");
            }
        });
    };

    const items = [
        {
            title: "Üzlet információk",
            content: <StepBusinessInfo onNext={next} form={form} />,
        },
        {
            title: "Nyitvatartás",
        },
        {
            title: "Waiting",
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 min-h-dvh">
            <Steps
                className="pt-12 pb-12 max-w-2xl mx-auto"
                current={currentStep}
                items={items.map((item) => ({ title: item.title }))}
            />
            <Button
                variant="link"
                type="link"
                icon={<FaArrowLeft />}
                onClick={() => dispatch(setActiveBusinessEmployeeDefault())}
            >
                Vissza
            </Button>
            <div className="flex">
                <div className="hidden lg:flex flex-col max-w-lg justify-center items-center text-center gap-4">
                    <FaCheckCircle className="size-16 text-green-600" />
                    <p className="text-5xl font-semibold">Mindjárt kész!</p>
                    <p className="text-xl">
                        Már csak néhány lépés a testreszabásból, hogy könnyebben
                        megtaláljanak az ügyfeleid.
                    </p>
                </div>
                <div className="flex-1">
                    <Form onFinish={handleFinish} layout="vertical" form={form}>
                        {items[currentStep].content}
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CompleteOnboardingPage;

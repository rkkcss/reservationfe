import { Alert, Button } from "antd";
import { MouseEvent } from "react";
import ThemeSelectorForm from "../../../components/Forms/ThemeSelectorForm";
import { useForm } from "antd/es/form/Form";
import { onboardingThemeStepPostQuery } from "../../../helpers/queries/onboarding-queries";
import { BsArrowRight } from "react-icons/bs";

type Props = {
    onNext: (event?: MouseEvent<HTMLButtonElement>) => void;
    onLoadingChange: (loading: boolean) => void;
    onSkip: () => void;
};

const OnboardingThemeSelector = ({
    onNext,
    onLoadingChange,
    onSkip,
}: Props) => {
    const [form] = useForm();

    const handleOnfinish = ({ theme }: { theme: string }) => {
        onLoadingChange(true);
        onboardingThemeStepPostQuery(theme)
            .then((res) => {
                if (res.status === 200) {
                    onNext();
                }
            })
            .finally(() => onLoadingChange(false));
    };

    return (
        <div>
            <Alert
                type="info"
                showIcon
                title="Válaszd ki milyen témája legyen az oldaladnak. Ezt bármikor meg fogod tudni változtatni."
                className="mb-4"
            />
            <ThemeSelectorForm
                onFinish={handleOnfinish}
                form={form}
                footer={false}
                customFooter={
                    <div className="flex justify-end gap-4">
                        <Button type="text" onClick={onSkip}>
                            Kihagyás
                            <BsArrowRight />
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full sm:w-fit"
                        >
                            Következő
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default OnboardingThemeSelector;

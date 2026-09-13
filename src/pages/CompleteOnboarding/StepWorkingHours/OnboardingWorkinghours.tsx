import OpeningHoursForm from "../../../components/OpeningHoursForm";
import { useForm } from "antd/es/form/Form";
import { onboardingWorkingHoursQuery } from "../../../helpers/queries/onboarding-queries";
import { WorkingHours } from "../../../helpers/types/WorkingHours";
import dayjs from "dayjs";
import { Button } from "antd";
import { BsArrowRight } from "react-icons/bs";

type Props = {
    onSkip: () => void;
    onNext: () => void;
};

const OnboardingWorkinghours = ({ onSkip, onNext }: Props) => {
    const [form] = useForm();

    const handleFinish = async (values: { openingHours: WorkingHours[] }) => {
        const formattedOpeningHours = values.openingHours.map((item) => {
            const formattedStartTime = dayjs(item.startTime).format("HH:mm");
            const formattedEndTime = dayjs(item.endTime).format("HH:mm");

            return {
                ...item,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
            };
        });
        await onboardingWorkingHoursQuery(formattedOpeningHours).then((res) => {
            if (res.status === 200) {
                onNext();
            }
        });
    };

    return (
        <div>
            <p className="text-3xl font-semibold mb-4">Mikor dolgozol?</p>
            <OpeningHoursForm
                form={form}
                onSubmit={handleFinish}
                footer={false}
                customFooter={
                    <div className="flex justify-end">
                        <Button
                            type="text"
                            className="text-sm"
                            onClick={onSkip}
                        >
                            Kihagyás
                            <BsArrowRight />
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Következő
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default OnboardingWorkinghours;

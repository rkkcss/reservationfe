import { useEffect, useState } from "react";
import { Modal, Steps, Button, Form } from "antd";
import StepSelectOffering from "./StepSelectOffering";
import StepSelectAppointment from "./StepSelectAppointment";
import StepPersonalData from "./StepAddress";
import { Offering } from "../../../helpers/types/Offering";
import { createAppointmentByGuestQuery } from "../../../helpers/queries/appointment-queries";
import StepConfirm from "./StepConfirm";

const { Step } = Steps;

type AddAppointmentStepsProps = {
    offer: Offering;
    open: boolean;
    onClose: () => void;
    businessId: number;
}



const AddAppointmentSteps = ({ offer, open, onClose, businessId }: AddAppointmentStepsProps) => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [offerProp, setOfferProp] = useState<Offering>(offer);

    const steps = [
        {
            title: "Személyes adatok",
            fields: <StepPersonalData key={offer.id || "new"} />,
            fieldNames: ["name", "email", "phoneNumber"],
        },
        {
            title: "Szolgáltatás kiválasztása",
            fields: <StepSelectOffering offer={offerProp} setOffer={setOfferProp} />,
            fieldNames: ["offeringId"],
        },
        {
            title: "Időpont kiválasztása",
            fields: <StepSelectAppointment
                employeeId={offer.businessEmployee?.user?.id}
                businessId={businessId}
                durationMinutes={offerProp.durationMinutes} />,
            fieldNames: ["date", "time"],
        },
        {
            title: "Megerősítés",
            fields:
                <>
                    <StepConfirm form={form} />
                </>
            ,
        },
    ];


    useEffect(() => {
        if (!open) {
            setCurrent(0);
            form.resetFields();
        }
    }, [open])

    const next = async () => {
        try {
            await form.validateFields(steps[current].fieldNames);
            setCurrent(current + 1);
        } catch (err) {
            console.log("Validációs hiba:", err);
        }
    };


    const prev = () => {
        setCurrent(current - 1);
    };

    const handleFinish = async () => {
        let values = await form.getFieldsValue(true);
        values = {
            ...values,
            date: values.date?.format("YYYY-MM-DD"),
            businessId: businessId,
        }
        console.log("Beküldött adatok:", values);
        createAppointmentByGuestQuery(businessId, offer.businessEmployee?.user?.id, values)
            .then(() => {
                // onClose();
            });
    };



    return (
        <>
            <Modal
                title="Többlépéses Űrlap"
                open={open}
                footer={null}
                onCancel={onClose}
                destroyOnClose
            >
                <Steps current={current} size="small" style={{ marginBottom: 24 }} labelPlacement="vertical">
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <Form form={form} layout="vertical">
                    {steps[current].fields}

                    <div style={{ marginTop: 24, textAlign: "right" }}>
                        {current > 0 && (
                            <Button style={{ marginRight: 8 }} onClick={prev}>
                                Vissza
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                Tovább
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={handleFinish}>
                                Beküldés
                            </Button>
                        )}
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default AddAppointmentSteps;
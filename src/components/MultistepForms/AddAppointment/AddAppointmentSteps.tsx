import React, { useEffect, useState } from "react";
import { Modal, Steps, Button, Form, message } from "antd";
import StepSelectOffering from "./StepSelectOffering";
import StepSelectAppointment from "./StepSelectAppointment";
import StepPersonalData from "./StepAddress";
import { Offering } from "../../../helpers/types/Offering";
import { createAppointmentByGuestQuery } from "../../../helpers/queries/appointmentService";

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
        },
        {
            title: "Szolgáltatás kiválasztása",
            fields: <StepSelectOffering offer={offerProp} setOffer={setOfferProp} />,
        },
        {
            title: "Időpont kiválasztása",
            fields: <StepSelectAppointment businessId={businessId} durationMinutes={offerProp.durationMinutes} />,
        },
        {
            title: "Megerősítés",
            fields:
                <p>
                    Kérjük, ellenőrizze a megadott adatokat, majd kattintson a "Beküldés" gombra az időpont foglalásához.
                    <br />
                    A foglalás után e-mailben értesítést küldünk Önnek.
                    <br />
                    {
                        Object.entries(form.getFieldsValue(true)).map(([key, value]) => (
                            <span key={key}>
                                {key}: {value?.toString()}
                                <br />
                            </span>
                        ))
                    }
                </p>,
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
            // Kinyerjük a mezőneveket típusosan
            const fields = React.Children.toArray(steps[current].fields.props.children)
                .filter(
                    (child): child is React.ReactElement<{ name: string }> =>
                        React.isValidElement(child) && typeof child.props?.name === "string"
                )
                .map((child) => child.props.name);

            await form.validateFields(fields);
            setCurrent(current + 1);
        } catch (err) {
            console.log("Validációs hiba:", err);
        }
    };


    const prev = () => {
        setCurrent(current - 1);
    };

    const handleFinish = async () => {
        try {
            let values = await form.getFieldsValue(true);
            values = {
                ...values,
                date: values.date?.format("YYYY-MM-DD"),
                businessId: businessId,
            }
            console.log("Beküldött adatok:", values);
            createAppointmentByGuestQuery(values)
                .then(() => {
                    message.success("Sikeres beküldés!");
                });

        } catch (error) {
            console.log("Beküldés sikertelen:", error);
        }
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
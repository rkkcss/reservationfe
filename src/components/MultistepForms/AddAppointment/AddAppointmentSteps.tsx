import { useEffect, useState } from "react";
import { Modal, Steps, Button, Form, message } from "antd";
import StepSelectOffering from "./StepSelectOffering";
import StepSelectAppointment from "./StepSelectAppointment";
import StepPersonalData from "./StepAddress";
import { Offering } from "../../../helpers/types/Offering";
import { createAppointmentByGuestQuery } from "../../../helpers/queries/appointment-queries";
import dayjs from "dayjs";
import { LuCalendarDays, LuCircleUserRound, LuClock, LuMail, LuPhone } from "react-icons/lu";
import { MdOutlineDesignServices } from "react-icons/md";

const { Step } = Steps;

type AddAppointmentStepsProps = {
    offer: Offering;
    open: boolean;
    onClose: () => void;
    businessId: number;
}

const FORM_ITEMS = {
    phoneNumber: "Telefonszám",
    name: "Név",
    email: "Email",
    offeringId: "Szolgáltatás",
    time: "Idő",
    date: "Dátum",
}

const ICONS: Record<string, JSX.Element> = {
    name: <LuCircleUserRound size={30} />,
    email: <LuMail size={30} />,
    phoneNumber: <LuPhone size={30} />,
    date: <LuCalendarDays size={30} />,
    time: <LuClock size={30} />,
    offeringId: <MdOutlineDesignServices size={30} />
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
            fields: <StepSelectAppointment businessId={businessId} durationMinutes={offerProp.durationMinutes} />,
            fieldNames: ["date", "time"],
        },
        {
            title: "Megerősítés",
            fields:
                <>
                    <div className="flex flex-col gap-2">
                        {
                            Object.entries(form.getFieldsValue(true)).map(([key, value]) => {
                                if (key === "date" || key === "time") return null;

                                return (
                                    <div key={key} className="flex items-center gap-3 py-3 px-2 rounded-lg outline outline-gray-300 outline-1">
                                        <div className="p-2 bg-gray-200 rounded-full">
                                            {ICONS[key] ?? <LuCircleUserRound size={30} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-base">
                                                {FORM_ITEMS[key as keyof typeof FORM_ITEMS]}:
                                            </p>
                                            <p className="text-sm">
                                                {dayjs.isDayjs(value) ? value.format("YYYY.MM.DD") : value?.toString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        }

                        {/* Dátum + Idő egy sorban */}
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 py-4 px-2 outline outline-gray-300 outline-1 rounded-lg w-full">
                                <div className="p-2 bg-gray-200 rounded-full">
                                    <LuCalendarDays size={30} />
                                </div>
                                <div>
                                    <p className="font-bold text-base">{FORM_ITEMS["date"]}</p>
                                    <p className="text-sm">{dayjs(form.getFieldValue("date")).format("YYYY.MM.DD")}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 py-4 px-2 outline outline-gray-300 outline-1 rounded-lg w-full">
                                <div className="p-2 bg-gray-200 rounded-full">
                                    <LuClock size={30} />
                                </div>
                                <div>
                                    <p className="font-bold text-base">{FORM_ITEMS["time"]}</p>
                                    <p className="text-sm">{form.getFieldValue("time")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
        createAppointmentByGuestQuery(values)
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
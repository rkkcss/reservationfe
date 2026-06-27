import { usePublicReservation } from '../../context/PublicAppointmentReservation';
import { Button, Divider, Modal, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { CreateAppointmentByGuestProps } from '../../helpers/types/Appointment';
import { createAppointmentByGuestQuery } from '../../helpers/queries/appointment-queries';

const PublicAppointmentSummaryModal = () => {
    const { form, isSummaryModalOpen, setIsSummaryModalOpen } = usePublicReservation();

    // Lekérjük az adatokat a formból
    const formValues = form.getFieldsValue(["offering", "employeeId", "date", "time", "name", "phoneNumber", "email"]);
    const { offering, date, time, name, phoneNumber, email } = formValues;

    const handleSubmit = async () => {
        try {
            // 1. Megvárjuk a manuális validációt. Ha hibás, a kód átugrik a catch ágba!
            const validatedValues = await form.validateFields();

            const { offering: selectedOffering, ...rest } = validatedValues;

            const payload: CreateAppointmentByGuestProps = {
                ...rest,
                offeringId: selectedOffering.id,
                date: dayjs(validatedValues.date).format("YYYY-MM-DD"),
            };

            console.log("Beküldött adatok:", payload);

            // Beküldés a szerverre
            await createAppointmentByGuestQuery(payload.employeeId, payload);

            message.success("Sikeres foglalás!");
            form.resetFields();
            setIsSummaryModalOpen(false);

        } catch (errorInfo) {
            console.log("Hiba történt:", errorInfo);
        }
    }

    return (
        <Modal
            width={"400px"}
            open={isSummaryModalOpen}
            onCancel={() => setIsSummaryModalOpen(false)}
            title={<Typography.Title level={3} className="!mb-8 !font-bold">Foglalás összegzése</Typography.Title>}
            footer={false}
        >
            <div className="mb-6">
                <Typography.Paragraph className="text-xs uppercase font-bold text-gray-400 !my-1">Időpont</Typography.Paragraph>
                <Typography.Paragraph className="!my-0 font-semibold text-lg">
                    {date ? dayjs(date).format("YYYY. MM. DD.") : ''}, {time}
                </Typography.Paragraph>
            </div>

            <div className="mb-6">
                <Typography.Paragraph className="text-xs uppercase font-bold text-gray-400 !my-1">Szolgáltatás</Typography.Paragraph>
                {/* Opcionális láncolás (?.) használata, hogy ne szálljon el ha nincs még érték */}
                <Typography.Paragraph className="!my-0 font-semibold text-lg">{offering?.description}</Typography.Paragraph>
            </div>

            <div className="mb-6">
                <Typography.Paragraph className="text-xs uppercase font-bold text-gray-400 !my-1">Vendég</Typography.Paragraph>
                <Typography.Paragraph className="!my-0 font-semibold text-lg">{name}</Typography.Paragraph>
                <Typography.Paragraph className="!my-0 font-semibold text-base">{email} - {phoneNumber}</Typography.Paragraph>
            </div>

            <Divider />

            <div>
                <Typography.Paragraph className="text-xs uppercase font-bold text-gray-400 !my-1">Fizetendő</Typography.Paragraph>
                {/* Ha még nincs ára, 0 Ft-ot ír ki */}
                <Typography.Text className="font-bold text-3xl">{offering?.price ?? 0} Ft</Typography.Text>
            </div>

            <div className="flex flex-col gap-3 mt-5">
                <Button size="large" type="primary" onClick={handleSubmit}>Foglalás véglegesitése</Button>
                <Button type="text" onClick={() => setIsSummaryModalOpen(false)}>Módositás</Button>
            </div>
        </Modal>
    )
}

export default PublicAppointmentSummaryModal;
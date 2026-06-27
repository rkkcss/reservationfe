import { Button, Form } from 'antd'
import { usePublicReservation } from '../../context/PublicAppointmentReservation'
import { Offering } from '../../helpers/types/Offering';

const PublicAppointmentSummary = () => {
    const { form } = usePublicReservation();
    const selectedFormOffer: Offering | undefined = Form.useWatch("offering", form);
    const price = selectedFormOffer?.price ?? 0;

    return (
        <>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest">Fizetendő</p>

                    <p className="text-3xl font-bold text-primary tabular-nums tracking-tight">
                        {price} Ft
                    </p>
                </div>
            </div>
            <Button type="primary" className="w-full" size="large" htmlType="submit" >
                Foglalás megerősítése
            </Button>
        </>
    )
}

export default PublicAppointmentSummary;
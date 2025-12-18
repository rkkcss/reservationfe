import { Drawer } from 'antd'

import { useAppSelector } from '../../store/hooks';
import PendingAppointment from './PendingAppointment';

type PendingAppointmentsListProps = {
    open: boolean;
    onClose: () => void;
}

const PendingAppointmentsList = ({ open, onClose }: PendingAppointmentsListProps) => {
    const { pendingAppointments } = useAppSelector((state) => state.appointmentStore);

    return (
        <Drawer open={open} title="Függőben lévő időpontok" placement="right" width={800} onClose={onClose} destroyOnClose>
            <ul>
                {pendingAppointments.map((appointment) => (
                    <PendingAppointment key={appointment.id} appointment={appointment} />
                ))}
            </ul>
        </Drawer >
    )
}

export default PendingAppointmentsList
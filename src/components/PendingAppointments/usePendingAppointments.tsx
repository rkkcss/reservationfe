import { useEffect, useState } from 'react'
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { Appointment } from '../../helpers/types/Appointment';
import { approveAppointmentById, cancelAppointmentById } from '../../helpers/queries/appointmentService';
import { message } from 'antd';

const usePendingAppointments = () => {
    const { data, fetchData, setData, loading } = useCustomQuery({ url: "/api/appointments/pendings" });
    const [drawerOpen, setDrawerOpen] = useState(false);

    const approveAppointment = async (id?: number) => {
        if (!id) return;
        const res = await approveAppointmentById(id);
        if (res.status === 200) {
            setData((prev: Appointment[]) => prev.filter((a) => a.id !== id));
            console.log(data)
            message.success("Időpont jóváhagyva");
        }
    };

    const cancelAppointment = async (id?: number) => {
        if (!id) return;
        const res = await cancelAppointmentById(id);
        if (res.status === 200) {
            setData((prev: Appointment[]) => prev.filter((a) => a.id !== id));
            message.success("Időpont elutasítva");
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData])
    return { data, loading, drawerOpen, setDrawerOpen, approveAppointment, cancelAppointment, setData };
}

export default usePendingAppointments
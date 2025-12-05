import { useEffect, useState } from 'react'
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { Appointment, APPOINTMENT_STATUSES } from '../../helpers/types/Appointment';
import { approveAppointmentById, cancelAppointmentById } from '../../helpers/queries/appointment-queries';
import { message } from 'antd';
import { useCalendar } from '../../context/CalendarContext';
import dayjs from 'dayjs';

const usePendingAppointments = () => {
    const { data, fetchData, setData, loading } = useCustomQuery({ url: "/api/appointments/pendings" });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { setAppointments, appointments } = useCalendar();

    useEffect(() => {
        if (!appointments) return;
        const now = dayjs();

        setData((prev) => {
            const pendingFromAppointments = appointments.filter(a =>
                a.status === APPOINTMENT_STATUSES.PENDING &&
                dayjs(a.startDate).isAfter(now.startOf("day"))
            );

            const merged = [
                ...pendingFromAppointments,
                ...prev.filter(p => !appointments.some(a => a.id === p.id))
            ];

            return merged;
        });
    }, [appointments]);


    const approveAppointment = async (id?: number) => {
        if (!id) return;
        const res = await approveAppointmentById(id);
        if (res.status === 200) {
            setData((prev: Appointment[]) => prev.filter((a) => a.id !== id));
            //set global appointments state
            setAppointments((prev) => {
                return prev.map((e) => (e.id == res.data.id ? { ...e, status: APPOINTMENT_STATUSES.CONFIRMED } : e));
            });
        };
    }

    const cancelAppointment = async (id?: number) => {
        if (!id) return;
        const res = await cancelAppointmentById(id);
        if (res.status === 200) {
            setData((prev: Appointment[]) => prev.filter((a) => a.id !== id));
            setAppointments((prev) => {
                return prev.map((e) => (e.id == res.data.id ? { ...e, status: APPOINTMENT_STATUSES.CANCELLED } : e));
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData])
    return { data, loading, drawerOpen, setDrawerOpen, approveAppointment, cancelAppointment, setData };
}

export default usePendingAppointments
import PendingAppointmentsAlert from "./PendingAppointmentsAlert";
import PendingAppointmentsList from "./PendingAppointmentsList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppointmentStore } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import { fetchPendingAppointments } from "../../redux/appointmentsSlice";

const PendingAppointments = () => {
    const { pendingAppointments } = useSelector((state: AppointmentStore) => state.appointmentStore);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchPendingAppointments());
    }, [dispatch]);

    return (
        <>
            <PendingAppointmentsAlert
                dataLength={pendingAppointments.length ?? 0}
                onViewClick={() => setDrawerOpen(true)}
            />
            <PendingAppointmentsList
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    )
}

export default PendingAppointments
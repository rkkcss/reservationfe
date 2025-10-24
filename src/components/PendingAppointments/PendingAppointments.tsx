import PendingAppointmentsAlert from "./PendingAppointmentsAlert";
import usePendingAppointments from "./usePendingAppointments";
import PendingAppointmentsList from "./PendingAppointmentsList";
import { useCalendar } from "../../context/CalendarContext";

const PendingAppointments = () => {
    const { data, loading, drawerOpen, setDrawerOpen, approveAppointment, cancelAppointment } = usePendingAppointments();
    const { calendarRef } = useCalendar();

    return (
        <>
            <PendingAppointmentsAlert
                loading={loading}
                dataLength={data?.length ?? 0}
                onViewClick={() => setDrawerOpen(true)}
            />
            <PendingAppointmentsList
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                data={data}
                calendarRef={calendarRef}
                onApprove={approveAppointment}
                onCancel={cancelAppointment}
            />
        </>
    )
}

export default PendingAppointments
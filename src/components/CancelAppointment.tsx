import { Button, Result } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { cancelAppointmentByGuestWithToken, getAppointmentByModifierToken } from '../helpers/queries/appointment-queries';
import { Appointment } from '../helpers/types/Appointment';
import dayjs from 'dayjs';
import { IoCalendarOutline } from 'react-icons/io5';
import { LuUserRound } from "react-icons/lu";
import { Popconfirm, Skeleton, Spin } from 'antd/lib';
import { MdDeleteForever } from 'react-icons/md';
import { RiServiceLine } from 'react-icons/ri';
import { notificationManager } from '../utils/notificationConfig';

const CancelAppointment = () => {
    const { modifierToken } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);

    useEffect(() => {
        if (!modifierToken) return;
        setLoading(true);
        getAppointmentByModifierToken(modifierToken)
            .then(res => {
                setAppointment(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err?.title || 'Hiba történt az időpont lekérésekor');
                setAppointment(null);
            })
            .finally(() => setLoading(false));
    }, [modifierToken]);

    if (!modifierToken) return <Result status="404" title="Hibás token" />;

    const handleCancelAppointment = () => {
        setCancelLoading(true);
        cancelAppointmentByGuestWithToken(modifierToken)
            .then(() => {
                notificationManager.success("appointment-cancelled", { message: 'Az időpont sikeresen lemondva' });
                setCancelSuccess(true);
                setAppointment(null);
                // Visszairányítás is lehetne pl:
                // navigate('/');
            })
            .catch(() => {
                notificationManager.error("appointment-cancel-failed", { message: 'Nem sikerült lemondani az időpontot, próbálja újra később' });
            })
            .finally(() => setCancelLoading(false));
    };

    if (loading) {
        return (
            <div className="max-w-screen-sm mx-auto">
                <Result status="warning" title="Töltjük a tartalmat..." extra={<Spin />} />
                <Skeleton active />
            </div>
        );
    }

    if (error) {
        return (
            <Result
                status="404"
                title={error}
                extra={<Button onClick={() => window.location.reload()}>Újra próbálkozás</Button>}
            />
        );
    }

    if (cancelSuccess) {
        return (
            <Result
                status="success"
                title="Az időpont sikeresen lemondva"
                extra={<Button type="primary" onClick={() => navigate('/')}>Vissza a főoldalra</Button>}
            />
        );
    }

    if (!appointment) {
        return (
            <Result
                status="info"
                title="Nincs elérhető időpont a megadott token alapján"
            />
        );
    }

    return (
        <Result
            status="warning"
            title="Időpont módosítása vagy lemondása."
            extra={
                <>
                    <div className="mx-auto max-w-screen-sm text-base  mt-8">
                        <div className="flex gap-2 mb-2">
                            <LuUserRound size={20} strokeWidth={2} />
                            <p>{appointment.guest?.name}</p>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <IoCalendarOutline size={20} strokeWidth={3} />
                            <p>
                                {dayjs(appointment.startDate).format('YYYY. MMMM D. (dddd) hh:mm')} - {dayjs(appointment.endDate).format('HH:mm')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <RiServiceLine size={20} strokeWidth={0} />
                            <p>{appointment.offering?.title}</p> - <p>{appointment.offering?.durationMinutes} perc</p>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-center mt-5">
                        <Popconfirm
                            title="Biztosan törölni szeretné az időpontot?"
                            onConfirm={handleCancelAppointment}
                            okText="Igen"
                            cancelText="Nem"
                            okButtonProps={{ danger: true, loading: cancelLoading }}
                            cancelButtonProps={{ type: 'default', disabled: cancelLoading }}
                            icon={<MdDeleteForever className="text-red-500 mr-1" size={20} />}
                        >
                            <Button type="default" danger loading={cancelLoading}>
                                Lemondom
                            </Button>
                        </Popconfirm>
                        <Button type="primary" disabled>
                            Módosítom
                        </Button>
                    </div>
                </>
            }
        />
    );
};

export default CancelAppointment;

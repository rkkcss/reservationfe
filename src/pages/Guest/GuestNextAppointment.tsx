import { Badge, Card, Divider, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getGuestNextAppointmentById } from "../../helpers/queries/guest-queries";
import { FaRegCalendarCheck } from "react-icons/fa";
import {
    Appointment,
    APPOINTMENT_STATUSES_EXTENDED,
} from "../../helpers/types/Appointment";
import dayjs from "dayjs";
import Loading from "../../components/Loading";
import { IoTimerOutline } from "react-icons/io5";

const GuestNextAppointment = () => {
    const guestId = useParams<{ guestId: string }>().guestId;
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGuestNextAppointmentById(Number(guestId))
            .then((res) => {
                setNextAppointment(res.data);
                setLoading(false);
            })
            .catch(() => setNextAppointment(null))
            .finally(() => setLoading(false));
    }, [guestId]);

    if (!loading && !nextAppointment) {
        return null;
    }

    return (
        <Spin spinning={loading} indicator={<Loading size={28} />}>
            <Card className="mt-8 bg-yellow-100/30" loading={loading}>
                <div className="flex justify-between items-center">
                    <Typography.Title
                        level={4}
                        className="flex items-center gap-2"
                    >
                        <IoTimerOutline />
                        Következő lefoglalt időpont
                    </Typography.Title>
                    {nextAppointment && (
                        <Badge
                            count={
                                APPOINTMENT_STATUSES_EXTENDED[
                                    nextAppointment?.status
                                ].label
                            }
                            color={
                                APPOINTMENT_STATUSES_EXTENDED[
                                    nextAppointment?.status
                                ].color
                            }
                        />
                    )}
                </div>
                <Divider classNames={{ root: "my-2" }} />
                <div>
                    <Typography.Title
                        level={3}
                        classNames={{ root: "!font-bold" }}
                    >
                        {nextAppointment?.offering.title}
                    </Typography.Title>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center">
                            <FaRegCalendarCheck size={22} className="mr-2" />
                            <Typography className="text-lg font-semibold">
                                {dayjs(nextAppointment?.startDate).format(
                                    "YYYY. MMMM DD.  HH:mm",
                                )}
                            </Typography>
                        </div>

                        <Typography className="text-lg font-semibold">
                            Szakember:{" "}
                            {nextAppointment?.businessEmployee.user.fullName}
                        </Typography>
                    </div>
                    <div>
                        <Typography className="text-lg font-bold mt-2 text-green-500">
                            {nextAppointment?.offering.price} Ft
                        </Typography>
                    </div>
                </div>
            </Card>
        </Spin>
    );
};

export default GuestNextAppointment;

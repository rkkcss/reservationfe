import { Badge, Button, Drawer } from "antd";
import { useCustomQuery } from "../hooks/useAppointments"
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const PendingAppointments = () => {
    const { data, fetchData } = useCustomQuery({ url: "/api/appointments/pendings" });
    const [drawerOpen, setDrawerOpen] = useState(false);
    console.log(data)

    useEffect(() => {
        fetchData();

    }, [fetchData])

    console.log(data.length)

    return (
        <>


            <div className="mr-0 ml-auto">
                <Button type="text" onClick={() => setDrawerOpen(true)} className="w-fit" disabled={data.length === 0}>
                    <Badge count={data.length} showZero />  függőben lévő időpont
                </Button>
            </div>

            <Drawer open={drawerOpen} title="Függőben lévő időpontok" placement="right" width={600} onClose={() => setDrawerOpen(false)} destroyOnClose>
                <ul>
                    {data?.map((appointment) => (
                        <li key={appointment.id} className="flex flex-col justify-between items-start p-2 border-b">
                            <div>
                                <strong>{appointment.guest.name}</strong>
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <p>
                                    {dayjs(appointment.startDate).format("YYYY.MM.DD hh:mm")} - {dayjs(appointment.endDate).format("YYYY.MM.DD hh:mm")}
                                </p>
                                <div>
                                    <Button type="primary">
                                        Elfogad
                                    </Button>
                                    <Button type="default" danger className="ml-2">
                                        Elutasít
                                    </Button>
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>
            </Drawer >
        </>
    )
}

export default PendingAppointments
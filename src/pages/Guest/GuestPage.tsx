import { useEffect, useState } from "react";
import { getGuestByGuestId } from "../../helpers/queries/guest-queries";
import { useParams } from "react-router-dom";
import { Guest } from "../../helpers/types/Guest";
import { Avatar, Badge } from "antd";
import GuestStatisticNumbers from "./GuestStatisticNumbers";
import GuestNextAppointment from "./GuestNextAppointment";
import GuestAppointments from "./GuestAppointments";

const GuestPage = () => {
    const guestId = useParams<{ guestId: string }>().guestId;
    const [guest, setGuest] = useState<Guest | null>(null);

    useEffect(() => {
        getGuestByGuestId(Number(guestId)).then((response) => {
            setGuest(response.data);
        });
    }, [guestId]);

    return (
        <div className="p-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <Avatar className="size-16 text-2xl">
                        {guest?.name.charAt(0)}
                    </Avatar>
                    <div>
                        <div className="flex items-center space-x-2">
                            <p className="text-lg font-semibold">
                                {guest?.name}
                            </p>
                            <Badge
                                color={guest?.canBook ? "green" : "red"}
                                count={guest?.canBook ? "Aktív" : "Tiltott"}
                            />
                        </div>
                        <p className="text-gray-600">{guest?.email}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <GuestStatisticNumbers />
            </div>
            <div>
                <GuestNextAppointment />
            </div>
            <div className="mt-4">
                <GuestAppointments />
            </div>
        </div>
    );
};

export default GuestPage;

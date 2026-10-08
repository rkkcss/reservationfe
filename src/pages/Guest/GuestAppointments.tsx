import { Badge, Table } from "antd";
import { usePagination } from "../../hooks/usePagination";
import { useParams } from "react-router";
import {
    Appointment,
    APPOINTMENT_STATUSES_EXTENDED,
} from "../../helpers/types/Appointment";
import dayjs from "dayjs";
import CustomPagination from "../../components/CustomPagination";

const GuestAppointments = () => {
    const guestId = useParams<{ guestId: string }>().guestId;
    const {
        data: appointments,
        currentPage,
        fetchNextPage,
        fetchPrevPage,
        totalItems,
        fetchPage,
    } = usePagination<Appointment[]>(
        `/api/guests/${guestId}/appointments`,
        10,
        "desc",
        {},
        true,
    );

    const columns = [
        {
            title: "Dátum és idő",
            dataIndex: "startDate",
            render: (text: Date) => (
                <span>{dayjs(text).format("YYYY.MMMM.DD - HH:mm")}</span>
            ),
        },
        {
            title: "Szolgáltatás",
            dataIndex: ["offering", "title"],
        },
        {
            title: "Szakember",
            dataIndex: ["businessEmployee", "user", "fullName"],
        },
        {
            title: "Összeg",
            dataIndex: ["offering", "price"],
        },
        {
            title: "Státusz",
            dataIndex: "status",
            render: (text: string) => (
                <Badge
                    count={APPOINTMENT_STATUSES_EXTENDED[text].label}
                    color={APPOINTMENT_STATUSES_EXTENDED[text].color}
                />
            ),
        },
    ];

    return (
        <div>
            <Table
                scroll={{ x: "max-content" }}
                columns={columns}
                dataSource={appointments || []}
                pagination={false}
            />
            <CustomPagination
                totalItems={totalItems}
                currentPage={currentPage}
                fetchNextPage={fetchNextPage}
                fetchPage={fetchPage}
                fetchPrevPage={fetchPrevPage}
                pageSize={10}
            />
        </div>
    );
};

export default GuestAppointments;

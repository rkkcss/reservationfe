import { useEffect, useState } from "react"
import { UserStore } from "../../store/store";
import { useSelector } from "react-redux";
import { Button, Dropdown, Table, Tag, Tooltip } from "antd";
import { BusinessEmployeeInvite } from "../../helpers/types/BusinessEmployeeInvite";
import { businessEmployeeRoleLabels } from "../../helpers/types/BusinessEmployeeRole";
import { BusinessEmployeePermissonLabels } from "../../helpers/types/BusinessPermission";
import dayjs from "dayjs";
import { getAllBusinessEmployeeInvitesQuery } from "../../helpers/queries/business-employee-invite-queries";

const PendingEmployees = () => {
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const [pendingEmployees, setPendingEmployees] = useState<BusinessEmployeeInvite[]>([]);

    useEffect(() => {
        if (selectedBusinessEmployee) {
            getAllBusinessEmployeeInvitesQuery(Number(selectedBusinessEmployee.business.id))
                .then(response => {
                    console.log(response.data)
                    setPendingEmployees(response.data);
                })
        }
    }, [selectedBusinessEmployee])

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Pozíció",
            dataIndex: "role",
            key: "role",
            render: (role: string) => <Tag color="blue">{businessEmployeeRoleLabels[role]}</Tag>,
        },
        {
            title: "Jogosultságok",
            dataIndex: "permissions",
            key: "permissions",
            render: (permissions: string[]) => {
                const items = permissions.map(p => ({
                    key: p,
                    label: <Tag color="purple">{BusinessEmployeePermissonLabels[p]}</Tag>,
                }));

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button type="link">
                            {permissions.length} jogosultság
                        </Button>
                    </Dropdown>
                );
            },
        },
        {
            title: "Lejár",
            dataIndex: "expiresAt",
            key: "expiresAt",
            render: (date: string) => {
                const daysLeft = dayjs(date).diff(dayjs(), "day");

                let status: "error" | "warning" | "success";
                let text: string;

                if (daysLeft < 0) {
                    status = "error";
                    text = `Lejárt (${Math.abs(daysLeft)} napja)`;
                } else if (daysLeft <= 7) {
                    status = "warning";
                    text = `${daysLeft} nap múlva`;
                } else {
                    status = "success";
                    text = `${daysLeft} nap múlva`;
                }

                return (
                    <Tooltip title={dayjs(date).format("YYYY.MM.DD HH:mm")}>
                        <Tag
                            color={status}
                        >{text}</Tag>
                    </Tooltip>
                );
            }
        },
        {
            title: "Felhasználva?",
            dataIndex: "used",
            key: "used",
            render: (used: boolean) =>
                used ? <Tag color="red">Igen</Tag> : <Tag color="green">Nem</Tag>,
        },
    ];

    return (
        <div>
            <Table
                rowKey="id"
                dataSource={pendingEmployees}
                columns={columns}
                pagination={{ pageSize: 10 }}
            />
        </div>
    )
}

export default PendingEmployees
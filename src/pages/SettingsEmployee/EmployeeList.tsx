import { Button, Table, Tag } from 'antd'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee';
import { useNavigate } from 'react-router';
import { usePagination } from '../../hooks/usePagination';
import { employeeRolesExtended } from '../../helpers/types/BusinessEmployeeRole';
import { FaRegEdit } from 'react-icons/fa';

const EmployeeList = () => {
    const navigate = useNavigate();
    const { data } = usePagination<BusinessEmployee[]>('/api/business-employee/employees');

    const dataColumns = [
        {
            title: 'Nev',
            key: "id",
            render: (_: string, record: BusinessEmployee) => `${record.user.fullName}`
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: "email"
        },
        {
            title: 'Pozicio',
            dataIndex: ['role'],
            key: "role",
            render: (role: string) => (
                <Tag color={employeeRolesExtended[role]?.color}>
                    {employeeRolesExtended[role]?.label || role}
                </Tag>
            )
        },
        {
            title: '',
            key: 'action',
            render: (_: string, record: BusinessEmployee) => (
                <Button size="small" type="primary" onClick={() => navigate(`/settings/employee/${record.user.id}`)}>
                    <FaRegEdit />
                </Button>
            ),
        },
    ]
    return (
        <Table dataSource={data} columns={dataColumns} scroll={{ x: 10 }} />
    )
}

export default EmployeeList
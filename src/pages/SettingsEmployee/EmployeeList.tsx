import { Button, Dropdown, Table } from 'antd'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee';
import { MenuProps } from 'antd/lib';
import { useNavigate } from 'react-router';
import { IoMdArrowDropdown } from 'react-icons/io';
import { usePagination } from '../../hooks/usePagination';
import { useSelector } from 'react-redux';
import { UserStore } from '../../store/store';

const EmployeeList = () => {
    const navigate = useNavigate();
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const { data } = usePagination<BusinessEmployee>('/api/business-employee/business/' + selectedBusinessEmployee?.business.id + '/employees');

    const getActionDropDownItems = (): MenuProps['items'] => [
        {
            key: "edit",
            label: "Szerkesztés",
        },
        {
            key: "delete",
            label: <p className="text-red-500">Törlés</p>,
        }
    ];

    const handleMenuClick = (record: BusinessEmployee, key: string) => {
        if (key === 'edit') {
            navigate(`/settings/employee/${record.user.id}`);
        } else if (key === 'delete') {
            // törlés logika
        }
    };

    const dataColumns = [
        {
            title: 'Nev',
            key: "id",
            render: (_: string, record: BusinessEmployee) => `${record.user.firstName} ${record.user.lastName}`
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: "email"
        },
        {
            title: '',
            key: 'action',
            render: (_: string, record: BusinessEmployee) => (
                <Dropdown
                    menu={{
                        items: getActionDropDownItems(),
                        onClick: ({ key }) => handleMenuClick(record, key)
                    }}
                    trigger={['click']}
                >
                    <Button onClick={(e) => e.preventDefault()} size="small" icon={<IoMdArrowDropdown size={25} />}>
                    </Button>
                </Dropdown>
            ),
        },
    ]
    return (
        <Table dataSource={data} columns={dataColumns} />
    )
}

export default EmployeeList
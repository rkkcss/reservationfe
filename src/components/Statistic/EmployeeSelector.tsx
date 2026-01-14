import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useStatistic } from '../../context/StatisticContext';
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee';
import { getEmployeesByBusinessId } from '../../helpers/queries/business-employee';
import { useAppSelector } from '../../store/hooks';
import { FaRegAddressCard } from 'react-icons/fa';


const EmployeeSelector = () => {
    const { selectedEmployeeFilter, setSelectedEmployeeFilter } = useStatistic();
    const [employees, setEmployees] = useState<BusinessEmployee[]>([]);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    console.log(selectedEmployeeFilter)
    useEffect(() => {
        getEmployeesByBusinessId(Number(selectedBusinessEmployee?.business.id)).then(res => {
            console.log(res.data)
            setEmployees(res.data)
        });
    }, [])

    return (
        <>
            <Select size='large' className="w-full sm:w-56" value={selectedEmployeeFilter} onChange={(value) => setSelectedEmployeeFilter(value)} prefix={<FaRegAddressCard />}>
                <Select.Option value="all">Minden alkalmazott</Select.Option>
                {employees.map(employee => (
                    <Select.Option key={employee.id} value={employee.user.id}>{employee.user.firstName} {employee.user.lastName}</Select.Option>
                ))}
            </Select>
        </>
    )
}

export default EmployeeSelector
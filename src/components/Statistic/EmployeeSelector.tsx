import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useStatistic } from '../../context/StatisticContext';
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee';
import { getEmployeesByBusinessId } from '../../helpers/queries/business-employee';
import { useAppSelector } from '../../store/hooks';
import { FaRegAddressCard } from 'react-icons/fa';
import useSelectedEmployee from '../../hooks/useSelectedEmployee';
import { BUSINESS_PERMISSIONS } from '../../helpers/types/BusinessPermission';


const EmployeeSelector = () => {
    const { selectedEmployeeFilter, setSelectedEmployeeFilter } = useStatistic();
    const [employees, setEmployees] = useState<BusinessEmployee[]>([]);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const { hasPermission } = useSelectedEmployee();

    useEffect(() => {
        getEmployeesByBusinessId().then(res => {
            if (hasPermission(BUSINESS_PERMISSIONS.VIEW_ALL_STATISTICS)) {
                return setEmployees(res.data);
            }
            setEmployees(res.data.filter(employee => employee.user.id === selectedBusinessEmployee?.user.id));
            setSelectedEmployeeFilter(Number(selectedBusinessEmployee?.user.id));
        });
    }, []);

    return (
        <>
            <label className="block text-sm font-medium text-gray-700">Alkalmazott</label>
            <Select size="large" className="w-full sm:w-56" value={selectedEmployeeFilter} onChange={(value) => setSelectedEmployeeFilter(value)} prefix={<FaRegAddressCard />}>
                {
                    hasPermission(BUSINESS_PERMISSIONS.VIEW_ALL_STATISTICS) &&
                    <Select.Option value={"all"}>Összes alkalmazott</Select.Option>
                }
                {employees.map(employee => (
                    <Select.Option key={employee.id} value={employee.user.id}>{employee.user.firstName} {employee.user.lastName}</Select.Option>
                ))}
            </Select>
        </>
    )
}

export default EmployeeSelector
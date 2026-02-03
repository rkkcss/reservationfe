import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { getEmployeesByBusinessId } from '../../helpers/queries/business-employee'
import { useAppSelector } from '../../store/hooks'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee'


type SettingsGuestsHeaderProps = {
    setQueryParams: (params: Record<string, string>) => void;
}
const SettingsGuestsHeader = ({ setQueryParams }: SettingsGuestsHeaderProps) => {
    const { selectedBusinessEmployee, user } = useAppSelector(state => state.userStore);
    const [employees, setEmployees] = useState<Array<BusinessEmployee>>([]);

    useEffect(() => {
        getEmployeesByBusinessId(Number(selectedBusinessEmployee?.business.id)).then(res => {
            if (res.status !== 200) {
                console.error("Failed to fetch employees");
                return;
            }
            setEmployees(res.data);
        })
    }, [])

    return (
        <Select className="w-44" defaultValue={"all"} onSelect={(e) => setQueryParams({ employeeSearchParam: e })}>
            <Select.Option value={"all"}>Összes alkalmazott</Select.Option>
            {
                employees.map(employee => (
                    <Select.Option key={employee.id} value={employee.id}>
                        {user?.id === employee.user.id &&
                            <span>(Én) </span>
                        }
                        <span>{employee.user.fullName}</span>
                    </Select.Option>
                ))
            }
        </Select>
    )
}

export default SettingsGuestsHeader
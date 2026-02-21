import { Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { getEmployeesByBusinessId } from '../../helpers/queries/business-employee'
import { useAppSelector } from '../../store/hooks'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee'
import { useDebounce } from '../../hooks/useDebounce'
import { RequestParams } from '../../hooks/usePagination'


type SettingsGuestsHeaderProps = {
    setQueryParams: React.Dispatch<React.SetStateAction<RequestParams>>;
}
const SettingsGuestsHeader = ({ setQueryParams }: SettingsGuestsHeaderProps) => {
    const { selectedBusinessEmployee, user } = useAppSelector(state => state.userStore);
    const [employees, setEmployees] = useState<Array<BusinessEmployee>>([]);
    const [localFilter, setLocalFilter] = useState<string>("");
    const debouncedSearchTerm = useDebounce(localFilter, 500);

    useEffect(() => {
        getEmployeesByBusinessId(Number(selectedBusinessEmployee?.business.id)).then(res => {
            if (res.status !== 200) {
                console.error("Failed to fetch employees");
                return;
            }
            setEmployees(res.data);
        })
    }, [])

    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            filter: debouncedSearchTerm
        }));
    }, [debouncedSearchTerm, setQueryParams]);

    return (
        <div className="flex gap-4">
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
            <Input className="w-44" placeholder="Keresés..." onChange={(e) => setLocalFilter(e.target.value)} />
        </div>
    )
}

export default SettingsGuestsHeader
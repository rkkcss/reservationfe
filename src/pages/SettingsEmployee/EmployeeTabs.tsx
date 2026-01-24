import { Tabs } from 'antd'
import EmployeeInformations from './EmployeeInformations'
import EmployeePermissions from './EmployeePermissions'
import EmployeeOfferings from './EmployeeOfferings'
import EmployeeWorkingHours from './EmployeeWorkingHours'

const EmployeeTabs = () => {
    const tabs = [
        {
            key: 'info',
            label: 'Személyes adatok',
            children: <EmployeeInformations />
        },
        {
            key: 'permissions',
            label: 'Jogosultságok',
            children: <EmployeePermissions />
        },
        {
            key: 'working-hours',
            label: 'Munkabeosztás',
            children: <EmployeeWorkingHours />
        },
        {
            key: 'services',
            label: 'Szolgáltatások',
            children: <EmployeeOfferings />
        }
    ]


    return (
        <Tabs items={tabs} />
    )
}

export default EmployeeTabs
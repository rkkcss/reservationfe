import { Tabs } from 'antd'
import EmployeeInformations from './EmployeeInformations'
import EmployeePermissions from './EmployeePermissions'
import SettingsOpeningHours from '../../components/SettingsOpeningHours'

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
            children: <SettingsOpeningHours />
        }
    ]


    return (
        <Tabs items={tabs} />
    )
}

export default EmployeeTabs
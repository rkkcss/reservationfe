import { Grid, Select, Tabs } from 'antd'
import { useState } from 'react'
import EmployeeInformations from './EmployeeInformations'
import EmployeePermissions from './EmployeePermissions'
import EmployeeOfferings from './EmployeeOfferings'
import EmployeeWorkingHours from './EmployeeWorkingHours'
import EmployeeStatus from './EmployeeStatus'
import { useAppSelector } from '../../store/hooks'
import { useBusinessEmployee } from '../../context/BusinessEmployeeContext'

const { useBreakpoint } = Grid

const EmployeeTabs = () => {
    const screens = useBreakpoint();
    const [activeKey, setActiveKey] = useState('info')
    const { user } = useAppSelector(state => state.userStore);
    const { businessEmployee } = useBusinessEmployee();

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
        },
        {
            key: 'status',
            label: 'Státusz',
            children: <EmployeeStatus />
        }
    ].filter(tab => {
        if (tab.key === 'status' && user?.id === businessEmployee?.user?.id) return false;
        return true;
    });

    const activeTab = tabs.find(tab => tab.key === activeKey)

    return (
        <div>
            {screens.lg
                ? <Tabs activeKey={activeKey} onChange={setActiveKey} items={tabs} />
                : (
                    <>
                        <Select
                            value={activeKey}
                            onChange={setActiveKey}
                            options={tabs.map(tab => ({ label: tab.label, value: tab.key }))}
                            style={{ width: '100%', marginBottom: 16 }}
                        />
                        {activeTab?.children}
                    </>
                )
            }
        </div>
    )
}

export default EmployeeTabs
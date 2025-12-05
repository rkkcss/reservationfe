import { BusinessEmployeeProvider } from '../../context/BusinessEmployeeContext'
import SettingsEmployeePage from './SettingsEmployeePage'

const EmployeeLayout = () => {
    return (
        <BusinessEmployeeProvider>
            <SettingsEmployeePage />
        </BusinessEmployeeProvider>
    )
}

export default EmployeeLayout
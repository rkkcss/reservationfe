
import { getWorkingHoursByBusinessEmployee, updateWorkingHours } from '../../helpers/queries/working-hours-queries'
import { useBusinessEmployee } from '../../context/BusinessEmployeeContext'
import { useAppSelector } from '../../store/hooks'
import dayjs from 'dayjs'
import { WorkingHours } from '../../helpers/types/WorkingHours'
import SettingsOpeningHours from '../../components/OpeningHours/SettingsOpeningHours'

const EmployeeWorkingHours = () => {
    const { businessEmployee } = useBusinessEmployee();
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    const fetchEmployeeWorkingHours = () => {
        return getWorkingHoursByBusinessEmployee(Number(selectedBusinessEmployee?.business.id), Number(businessEmployee?.user.id))
    }
    const handleOpeningHoursSubmit = (values: { openingHours: WorkingHours[] }) => {
        const formattedOpeningHours = values.openingHours.map((item) => {
            const formattedStartTime = dayjs(item.startTime).format("HH:mm");
            const formattedEndTime = dayjs(item.endTime).format("HH:mm");

            return { ...item, startTime: formattedStartTime, endTime: formattedEndTime };
        });

        updateWorkingHours(Number(selectedBusinessEmployee?.business.id), Number(businessEmployee?.user.id), formattedOpeningHours)
            .then(res => {
                console.log(res);
            });
    }

    return (
        <>
            <p className="text-2xl font-semibold mb-2">Munkabeosztás</p>
            <p className="text-gray-600 mb-6">Állítsd be mettől meddig tudjon dolgozni a munkatárs</p>
            <div className="bg-white p-5 rounded-xl">
                <SettingsOpeningHours
                    handleSubmit={handleOpeningHoursSubmit}
                    fetchOpeningHours={fetchEmployeeWorkingHours}
                />
            </div>
        </>
    )
}

export default EmployeeWorkingHours
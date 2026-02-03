import dayjs from 'dayjs';
import { updateWorkingHours } from '../helpers/queries/working-hours-queries';
import { WorkingHours } from '../helpers/types/WorkingHours';
import { useAppSelector } from '../store/hooks';
import SettingsOpeningHours from './OpeningHours/SettingsOpeningHours'

const OpeningHours = () => {
    const { selectedBusinessEmployee } = useAppSelector((state) => state.userStore);

    const handleWorkingHoursSubmit = (values: { openingHours: WorkingHours[] }) => {
        console.log(values)
        const formattedOpeningHours = values.openingHours.map((item) => {
            const formattedStartTime = dayjs(item.startTime).format("HH:mm");
            const formattedEndTime = dayjs(item.endTime).format("HH:mm");

            return { ...item, startTime: formattedStartTime, endTime: formattedEndTime };
        });
        console.log(formattedOpeningHours)
        updateWorkingHours(Number(selectedBusinessEmployee?.business.id), Number(selectedBusinessEmployee?.user.id), formattedOpeningHours)
            .then(res => {
                console.log(res);
            });
    };
    return (
        <div className="flex flex-col w-full pl-5 mt-5">
            <h1 className="text-2xl font-bold mb-4">Saját munkaidő</h1>
            <SettingsOpeningHours handleSubmit={handleWorkingHoursSubmit} />
        </div>
    )
}

export default OpeningHours
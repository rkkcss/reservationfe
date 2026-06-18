import { useBusinessConfigProvider } from '../../context/ConfigProviderBusinessContext';
import { CiLocationOn } from 'react-icons/ci';
import { GoInfo } from 'react-icons/go';
import { LuPhone } from 'react-icons/lu';
import { DAY_OF_WEEK } from '../../helpers/types/OpeningHour'
import dayjs from 'dayjs';
import { Typography } from 'antd';

const BusinessContact = () => {
    const { business } = useBusinessConfigProvider();

    const groupedHours = business?.openingHours?.reduce((acc, day) => {
        const dayKey = day.dayOfWeek;

        if (!acc[dayKey]) {
            acc[dayKey] = [];
        }

        acc[dayKey].push({
            startTime: day.startTime,
            endTime: day.endTime
        });
        return acc;
    }, {} as Record<number, { startTime: Date; endTime: Date }[]>);

    return (
        <div className={`p-5 max-w-96 rounded-lg min-w-[300px] shadow-md`}>
            <Typography.Title level={4}>Elérhetőségek</Typography.Title>
            {
                business.address &&
                <div className="flex items-center gap-4 mb-4">
                    <CiLocationOn strokeWidth={1} size={22} className="min-w-fit" />
                    <Typography className="">
                        {business.address}
                    </Typography>
                </div>
            }
            {
                business.phoneNumber &&
                <div className="flex items-center gap-4 mb-4">
                    <LuPhone size={22} strokeWidth={2} className="min-w-fit" />
                    <Typography className="text-sm">
                        {business.phoneNumber}
                    </Typography>
                </div>
            }
            {
                business.description &&
                <div className="flex items-center gap-4 mb-4">
                    <GoInfo strokeWidth={1} size={22} className="min-w-fit "
                    />
                    <Typography className="text-sm "
                    >
                        {business.description}
                    </Typography>
                </div>
            }
            <Typography.Title level={4} >Nyitvatartás:</Typography.Title>
            {
                business.openingHours?.length === 0 &&
                <div>
                    <Typography className="text-xs text-center mt-4 ">
                        Nincs megadva nyitvatartás!
                    </Typography>
                </div>
            }
            {groupedHours && Object.entries(groupedHours).map(([dayOfWeekKey, intervals]) => (
                <div key={dayOfWeekKey} className="flex justify-between text-slate-500 mb-2">
                    <Typography className="font-semibold" >{DAY_OF_WEEK[Number(dayOfWeekKey)]}:</Typography>

                    <div className="ml-4">
                        {intervals.map((interval, index) => (
                            <div key={index} className="flex justify-between w-full">
                                <Typography className="flex-1 text-right" >
                                    {dayjs(interval.startTime, "HH:mm").format("HH:mm")}
                                    -
                                    {dayjs(interval.endTime, "HH:mm").format("HH:mm")}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            ))}


        </div>
    )
}

export default BusinessContact
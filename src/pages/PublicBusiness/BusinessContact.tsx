import { useBusinessConfigProvider } from '../../context/ConfigProviderBusinessContext';
import { CiLocationOn } from 'react-icons/ci';
import { GoInfo } from 'react-icons/go';
import { LuPhone } from 'react-icons/lu';
import { DAY_OF_WEEK } from '../../helpers/types/OpeningHour'
import dayjs from 'dayjs';

const BusinessContact = () => {
    const { business, selectedTheme } = useBusinessConfigProvider();

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
        <div className={`p-5 max-w-96 rounded-lg min-w-[300px] shadow-md`}
            style={{ background: selectedTheme.cardBgColor }}>
            <p className="font-semibold text-xl mb-6"
                style={{ color: selectedTheme.primaryTextColor }}
            >Elérhetőségek</p>
            {
                business.address &&
                <div className="flex items-center gap-4 mb-4">
                    <CiLocationOn strokeWidth={1} size={22} className="min-w-fit"
                        style={{ color: selectedTheme.primaryTextColor }}
                    />
                    <p className="text-sm text-gray-600"
                        style={{ color: selectedTheme.secondaryTextColor }}
                    >
                        {business.address}
                    </p>
                </div>
            }
            {
                business.phoneNumber &&
                <div className="flex items-center gap-4 mb-4">
                    <LuPhone size={22} strokeWidth={2} className="min-w-fit"
                        style={{ color: selectedTheme.primaryTextColor }}
                    />
                    <p className="text-sm text-gray-600"
                        style={{ color: selectedTheme.secondaryTextColor }}
                    >
                        {business.phoneNumber}
                    </p>
                </div>
            }
            {
                business.description &&
                <div className="flex items-center gap-4 mb-4">
                    <GoInfo strokeWidth={1} size={22} className="min-w-fit "
                        style={{ color: selectedTheme.primaryTextColor }}
                    />
                    <p className="text-sm text-gray-600"
                        style={{ color: selectedTheme.secondaryTextColor }}
                    >
                        {business.description}
                    </p>
                </div>
            }
            <p className="leading-10 text-lg" style={{ color: selectedTheme.primaryTextColor }}>Nyitvatartás:</p>
            {
                business.openingHours?.length === 0 &&
                <div>
                    <p className="text-xs text-center mt-4 text-gray-600"
                        style={{ color: selectedTheme.secondaryTextColor }}
                    >
                        Nincs megadva nyitvatartás!
                    </p>
                </div>
            }
            {groupedHours && Object.entries(groupedHours).map(([dayOfWeekKey, intervals]) => (
                <div key={dayOfWeekKey} className="flex justify-between text-slate-500 mb-2">
                    <p className="font-semibold" style={{ color: selectedTheme.primaryTextColor }}>{DAY_OF_WEEK[Number(dayOfWeekKey)]}:</p>

                    <div className="ml-4 text-gray-900">
                        {intervals.map((interval, index) => (
                            <p key={index} className="flex justify-between w-full">
                                <span className="flex-1 text-right" style={{ color: selectedTheme.secondaryTextColor }}>
                                    {dayjs(interval.startTime, "HH:mm:ss").format("HH:mm")}
                                    -
                                    {dayjs(interval.endTime, "HH:mm:ss").format("HH:mm")}
                                </span>
                            </p>
                        ))}
                    </div>
                </div>
            ))}


        </div>
    )
}

export default BusinessContact
import { Button, DatePicker } from 'antd';
import { useStatistic } from '../../context/StatisticContext';
import dayjs from 'dayjs';
import { CiCalendarDate } from 'react-icons/ci';


const StatisticRangeSelector = () => {
    const { rangeKey, setRange, dateRange } = useStatistic();

    const buttonItems = [
        { key: 'today', label: 'Ma' },
        { key: 'last7days', label: 'Elmúlt 7 nap' },
        { key: 'thisMonth', label: 'Ez a hónap' },
        { key: 'lastMonth', label: 'Előző hónap' },
        { key: 'custom', label: 'Egyéni' },
    ];

    const handleButtonClick = (key: string) => {
        setRange(key);
    }
    return (
        <div>
            <div className="flex flex-wrap items-center gap-3 bg-gray-50/50 rounded-xl w-fit">
                <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-100">
                    {buttonItems.map((item) => (
                        <Button
                            key={item.key}
                            type={rangeKey === item.key ? 'primary' : 'text'}
                            onClick={() => handleButtonClick(item.key)}
                            className={`h-8 px-4 rounded-md transition-all duration-200 ${rangeKey === item.key ? 'shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
                {rangeKey === 'custom' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <DatePicker.RangePicker
                            allowClear={false}
                            placeholder={['Kezdet', 'Vége']}
                            className="h-10 rounded-lg border-gray-200 hover:border-blue-400"
                            onChange={(values) => {
                                if (values?.[0] && values?.[1]) {
                                    setRange('custom', [values[0], values[1]]);
                                }
                            }}
                        />
                    </div>
                )}
            </div>
            {dateRange.from && dateRange.to && (
                <>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                            <CiCalendarDate size={20} />
                        </span>
                        <span className="text-slate-500 text-sm font-medium ">Kiválasztott időszak:</span>
                        <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                            <span className="mr-2 text-slate-900 text-sm font-bold">
                                {dayjs(new Date(dateRange.from)).format('YYYY. MMMM DD.')}
                            </span>
                            -
                            <span className="ml-2 text-slate-900 text-sm font-bold">
                                {dayjs(new Date(dateRange.to)).format('YYYY. MMMM DD.')}
                            </span>
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

export default StatisticRangeSelector
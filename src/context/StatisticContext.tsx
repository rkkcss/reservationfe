import dayjs, { Dayjs } from "dayjs";
import { createContext, useContext, ReactNode, useState } from "react";

type StatisticContextType = {
    rangeKey: string;
    dateRange: { from: string; to: string };
    setRange: (key: string, customRange?: [Dayjs, Dayjs]) => void;
    selectedEmployeeFilter: number | string;
    setSelectedEmployeeFilter: (employee: number | string) => void;
};

const StatisticContext = createContext<StatisticContextType | undefined>(undefined);

export const StatisticProvider = ({ children }: { children: ReactNode }) => {
    const [rangeKey, setRangeKey] = useState<string>('today');
    const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<number | string>("all");

    const [dateRange, setDateRange] = useState({
        from: dayjs().startOf('day').toISOString(),
        to: dayjs().endOf('day').toISOString(),
    });

    const setRange = (key: string, customRange?: [Dayjs, Dayjs]) => {
        setRangeKey(key);

        if (key === 'custom' && !customRange) {
            return;
        }

        if (key === 'custom' && customRange) {
            setDateRange({
                from: customRange[0].startOf('day').toISOString(),
                to: customRange[1].endOf('day').toISOString(),
            });
            return;
        }

        const now = dayjs();
        let from: Dayjs = now;
        let to: Dayjs = now;

        switch (key) {
            case 'today':
                from = now.startOf('day');
                to = now.endOf('day');
                break;
            case 'last7days':
                from = now.subtract(7, 'day').startOf('day');
                to = now.endOf('day');
                break;
            case 'thisMonth':
                from = now.startOf('month');
                to = now.endOf('month');
                break;
            case 'lastMonth':
                from = now.subtract(1, 'month').startOf('month');
                to = now.subtract(1, 'month').endOf('month');
                break;
        }

        setDateRange({ from: from.toISOString(), to: to.toISOString() });
    };

    return (
        <StatisticContext.Provider
            value={{
                rangeKey,
                dateRange,
                setRange,
                selectedEmployeeFilter,
                setSelectedEmployeeFilter
            }}
        >
            {children}
        </StatisticContext.Provider>
    );
};

export const useStatistic = () => {
    const context = useContext(StatisticContext);
    if (!context) throw new Error("useStatistic must be used within a StatisticProvider");
    return context;
};

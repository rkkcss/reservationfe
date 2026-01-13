import { MdEmojiEvents } from "react-icons/md";
import { useStatistic } from "../../context/StatisticContext";
import { useEffect, useState } from "react";
import API from "../../utils/API";
import { useAppSelector } from "../../store/hooks";

type CustomerDistributionData = {
    newPercentage: number;
    returningPercentage: number;
    topCustomerBookings: number;
    topCustomerName: string;
};

const CustomerDistribution = () => {
    const { selectedEmployeeFilter, dateRange } = useStatistic();
    const { selectedBusinessEmployee } = useAppSelector((state) => state.userStore);
    const [data, setData] = useState<CustomerDistributionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.get(`/api/statistic/business/${selectedBusinessEmployee?.business.id}/customer-distribution`, {
            params: {
                businessEmployeeSearch: selectedEmployeeFilter,
                from: dateRange.from,
                to: dateRange.to,
            },
        })
            .then((res) => {
                setData(res.data);
            })
            .finally(() => setLoading(false));
    }, [selectedEmployeeFilter, dateRange, selectedBusinessEmployee]);

    const strokeDasharray = 251.2;
    const newPercent = data?.newPercentage || 0;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * newPercent) / 100;

    if (!data && loading) return <div className="p-6 text-center">Betöltés...</div>;

    return (
        <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-slate-900 text-lg font-bold mb-4">Ügyfélmegoszlás</h3>

            <div className="flex flex-col items-center gap-6 flex-1">
                <div className="flex items-center gap-8 mt-2">
                    {/* DINAMIKUS FÁNK GRAFIKON */}
                    <div className="relative size-32 flex items-center justify-center">
                        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                            {/* Alap kör - Visszatérők (Zöld) */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="#0bda5b"
                                strokeWidth="12"
                                fill="transparent"
                            />
                            {/* Dinamikus ív - Új ügyfelek (Primary/Kék) */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-primary"
                                strokeDasharray={strokeDasharray}
                                style={{
                                    strokeDashoffset: strokeDashoffset,
                                    transition: "stroke-dashoffset 0.8s ease-in-out",
                                }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            {/* <span className="text-sm font-bold text-slate-800">100%</span> */}
                        </div>
                    </div>

                    {/* JELMAGYARÁZAT */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 bg-[#0bda5b] rounded-full"></div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold">Visszatérő</p>
                            </div>
                            <p className="text-xl font-bold text-slate-900 ml-4">
                                {Math.round(data?.returningPercentage || 0)}%
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 bg-primary rounded-full"></div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold">Új Ügyfél</p>
                            </div>
                            <p className="text-xl font-bold text-slate-900 ml-4">
                                {Math.round(data?.newPercentage || 0)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* LEGAkTÍVABB ÜGYFÉL KÁRTYA */}
                <div className="w-full bg-slate-50 p-3 rounded-lg flex items-center gap-3 mt-auto">
                    <span className="material-symbols-outlined text-amber-500">
                        <MdEmojiEvents size={28} />
                    </span>
                    <div className="flex-1">
                        <p className="text-xs text-slate-500">Legaktívabb Ügyfél</p>
                        <p className="text-sm font-bold text-slate-900">{data?.topCustomerName} ({data?.topCustomerBookings} foglalás)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDistribution;
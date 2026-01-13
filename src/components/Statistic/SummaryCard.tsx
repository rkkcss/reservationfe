import React from 'react'
import { FaArrowTrendUp } from 'react-icons/fa6';
import Loading from '../Loading';
import { Spin } from 'antd';

type SummaryCardProps = {
    trend: string;
    icon: React.ReactNode;
    title: string;
    value: number;
    suffix?: string;
    loading?: boolean;
}

const SummaryCard = ({ trend, icon, title, value, loading, suffix }: SummaryCardProps) => {
    const formattingValue = (val: number) => {
        if (val === undefined || val === null) return "0";
        return val.toLocaleString("hu-HU");
    };

    return (
        <Spin spinning={loading} indicator={<Loading size={30} />}>
            <div className="flex flex-col gap-1 p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                    <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        {icon}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        <span className="material-symbols-outlined text-sm">
                            <FaArrowTrendUp />
                        </span>
                        {trend}
                    </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-slate-900 text-2xl font-bold tracking-tight">
                    {formattingValue(value)} {suffix}
                </p>
            </div>
        </Spin>
    )
}
export default SummaryCard
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import API from "../../utils/API";
import { useStatistic } from "../../context/StatisticContext";
import { Empty, Progress, Spin } from "antd";
import Loading from "../Loading";

const TopOfferings = () => {
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const { dateRange, selectedEmployeeFilter } = useStatistic();
    const [topOfferings, setTopOfferings] = useState<{ offeringName: string, offeringCount: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        API.get(`/api/statistic/business/${selectedBusinessEmployee?.business.id}/top-offerings`, {
            params: {
                from: dateRange.from,
                to: dateRange.to,
                businessEmployeeSearch: selectedEmployeeFilter
            }
        }).then(response => {
            setTopOfferings(response.data);
        }).finally(() => {
            setLoading(false);
        });
    }, [dateRange, selectedEmployeeFilter]);

    return (

        <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm h-full">
            <Spin spinning={loading} indicator={<Loading size={30} />} wrapperClassName="h-full">
                <h3 className=" text-lg font-bold mb-4">Top Szolgáltatások</h3>
                <div className="flex flex-col gap-4">

                    {(() => {
                        const totalCount = topOfferings.reduce((sum, item) => sum + item.offeringCount, 0);

                        return topOfferings.map((offering) => {
                            const percentage = totalCount > 0
                                ? Math.round((offering.offeringCount / totalCount) * 100)
                                : 0;

                            return (
                                <div key={offering.offeringName} className="">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700">
                                            {offering.offeringName}
                                        </span>
                                        <span className="text-slate-500 font-semibold">
                                            {offering.offeringCount} foglalás
                                        </span>
                                    </div>
                                    <Progress
                                        type="line"
                                        percent={percentage}
                                        showInfo={false}
                                    />
                                </div>
                            );
                        });
                    })()}
                    {topOfferings.length === 0 &&
                        <Empty description="Nincs megjeleníthető adat ebben az időszakban" />
                    }
                </div>
            </Spin>
        </div >
    )
}

export default TopOfferings
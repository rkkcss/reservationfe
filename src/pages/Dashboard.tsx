import PieChart from "../components/Charts/PieChart"
import SegmentedLine from "../components/Charts/SegmentedLine"
import LastComments from "../components/Statistic/LastComments";
import { StatisticProvider } from "../context/StatisticContext";
import TopOfferings from "../components/Statistic/TopOfferings";
import BusinessSummary from "../components/Statistic/BusinessSummary";
import StatisticRangeSelector from "../components/Statistic/StatisticRangeSelector";
import EmployeeSelector from "../components/Statistic/EmployeeSelector";
import CustomerDistribution from "../components/Statistic/CustomerDistribution";

function Dashboard() {

    return (
        <div className="mb-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">Statisztika és Elemzés</h1>
                <p className="text-slate-500 text-base font-normal">Kövesd nyomon szolgáltatásaid teljesítményét valós idejű adatokkal.</p>
            </div>
            <div className="flex justify-between items-center my-6">
                <StatisticRangeSelector />
                <EmployeeSelector />
            </div>
            <BusinessSummary />

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 gap-y-4 mt-8">
                <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl col-span-2">
                    <div className="mb-4">
                        <h3 className=" text-lg font-bold mb-1">Napi bevétel eloszlása</h3>
                        <p className="text-xs text-slate-500">Az összesített forgalom időbeli alakulása</p>
                    </div>
                    <SegmentedLine />
                </div>
                <div className="p-4 border bg-white border-slate-200 shadow-sm rounded-xl">
                    <p className=" text-lg font-bold mb-4">Foglalások alakulása az elmúlt években</p>
                    <PieChart />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <TopOfferings />
                <CustomerDistribution />
                <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
                    <LastComments />
                </div>
            </div>
        </div>
    )
}

export default function DashboardLayout() {
    return (
        <StatisticProvider>
            <Dashboard />
        </StatisticProvider>
    );
}

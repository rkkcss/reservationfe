import { useEffect, useState } from "react"
import API from "../../utils/API"
import { useAppSelector } from "../../store/hooks";
import { useStatistic } from "../../context/StatisticContext";
import SummaryCard from "./SummaryCard";
import { FaRegMoneyBill1 } from "react-icons/fa6";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";

type BusinessSummaryType = {
    totalRevenue: number;
    totalAppointments: number;
    newCustomers: number;
    reviewCount: number;
    averageRating: number;
}

const BusinessSummary = () => {
    const [summary, setSummary] = useState<BusinessSummaryType>({} as BusinessSummaryType);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const { dateRange, selectedEmployeeFilter } = useStatistic();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        API.get(`/api/statistic/business/${selectedBusinessEmployee?.business.id}/summary`, {
            params: {
                from: dateRange.from,
                to: dateRange.to,
                businessEmployeeSearch: selectedEmployeeFilter
            }
        }).then(response => {
            setSummary(response.data)
        }).finally(() => {
            setLoading(false);
        })
    }, [dateRange, selectedEmployeeFilter]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard icon={<FaRegMoneyBill1 size={22} />} title="Teljes Bevétel" value={summary.totalRevenue} suffix={"Ft"} trend="12%" loading={loading} />
            <SummaryCard icon={<CiCalendar size={22} />} title="Összes Foglalás" value={summary.totalAppointments} suffix={"db"} trend="12%" loading={loading} />
            <SummaryCard icon={<AiOutlineUsergroupAdd size={22} />} title="Új Ügyfelek" value={summary.newCustomers} suffix={"db"} trend="12%" loading={loading} />
            <SummaryCard icon={<FaStar size={22} />} title="Átlagos Értékelés" value={summary.averageRating} suffix={"értékelés"} trend="12%" loading={loading} />
        </div>
    )
}

export default BusinessSummary
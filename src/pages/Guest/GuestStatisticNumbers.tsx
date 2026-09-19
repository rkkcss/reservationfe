import { useEffect, useState } from "react";
import { getGuestStatisticsById } from "../../helpers/queries/guest-queries";
import { useParams } from "react-router";
import { GuestStatistics } from "../../helpers/types/Guest";
import { useTranslation } from "react-i18next";
import GuestStatisticNumbersItem from "./GuestStatisticNumbersItem";
import { Spin } from "antd";
import Loading from "../../components/Loading";

const GuestStatisticNumbers = () => {
    const { t } = useTranslation("guest-statistic-numbers");
    const guestId = useParams<{ guestId: string }>().guestId;
    const [loading, setLoading] = useState(true);

    const [guestStatistics, setGuestStatistics] =
        useState<GuestStatistics | null>(null);

    useEffect(() => {
        getGuestStatisticsById(Number(guestId))
            .then((response) => {
                setGuestStatistics(response.data);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    }, [guestId]);

    return (
        <Spin spinning={loading} indicator={<Loading size={28} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <GuestStatisticNumbersItem
                    text={t("allAppointmentCount")}
                    value={guestStatistics?.allAppointmentCount ?? 0}
                />
                <GuestStatisticNumbersItem
                    text={t("cancelledAppointmentCount")}
                    value={guestStatistics?.cancelledAppointmentCount ?? 0}
                />
                <GuestStatisticNumbersItem
                    text={t("didNotComeCount")}
                    value={guestStatistics?.didNotComeCount ?? 0}
                    classNames={{
                        text: "text-red-500",
                        value: "text-red-500",
                    }}
                />
                <GuestStatisticNumbersItem
                    text={t("appearedAppointmentCount")}
                    value={guestStatistics?.appearedAppointmentCount ?? 0}
                />
                <GuestStatisticNumbersItem
                    text={t("allSpentMoney")}
                    value={guestStatistics?.allSpentMoney ?? 0}
                />
            </div>
        </Spin>
    );
};

export default GuestStatisticNumbers;

import { DefaultOptionType } from "antd/es/select";
import { Appointment } from "../../helpers/types/Appointment";
import { BusinessEmployee } from "../../helpers/types/BusinessEmployee";
import { Guest } from "../../helpers/types/Guest";
import { useHighlight } from "../../hooks/useHighlight";
import { AppointmentOption } from "./AppointmentOption";
import { GuestOption } from "./GuestOption";
import { SectionTitle } from "./SectionTitle";
import { GlobalSearchType } from "./useGlobalSearch";

export type SearchOption = DefaultOptionType & {
    rawData?: Guest | BusinessEmployee | Appointment;
};

export const useGlobalSearchOptions = (data: GlobalSearchType, qString: string) => {
    const { highlightText } = useHighlight();

    const getFormattedOptions = (): SearchOption[] => {
        if (!data) return [];
        const sections: SearchOption[] = [];

        if (data.guests?.length) {
            sections.push({
                label: <SectionTitle title={`Vendégek (${data.guests.length})`} />,
                options: data.guests.map((item: Guest) => ({
                    value: `guest-${item.id}`,
                    label: <GuestOption item={item} highlight={(t) => highlightText(t, qString)} />,
                    rawData: item,
                })),
            });
        }

        if (data.appointments?.length) {
            sections.push({
                label: <SectionTitle title={`Foglalások (${data.appointments.length})`} />,
                options: data.appointments.map((item: Appointment) => ({
                    value: `app-${item.id}`,
                    label: <AppointmentOption item={item} highlight={(t) => highlightText(t, qString)} />,
                    rawData: item,
                })),
            });
        }

        return sections;
    };

    return { getFormattedOptions };
};
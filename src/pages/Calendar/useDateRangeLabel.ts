import { useCallback, useState } from "react";
import type { DatesSetArg } from "@fullcalendar/core";

export function useDateRangeLabel() {
    const [dateRange, setDateRange] = useState("");

    const updateDateRangeLabel = useCallback((arg: DatesSetArg) => {
        const start = arg.start;
        const end = new Date(arg.end.getTime() - 1);
        const fmt: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
        const startStr = new Intl.DateTimeFormat("hu-HU", fmt).format(start);
        const endStr = new Intl.DateTimeFormat("hu-HU", fmt).format(end);
        setDateRange(`${startStr} - ${endStr}`);
    }, []);

    return { dateRange, updateDateRangeLabel };
}
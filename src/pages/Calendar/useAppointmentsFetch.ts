import { useCallback, useRef } from "react";
import dayjs from "dayjs";
import type { DatesSetArg } from "@fullcalendar/core";
import { useAppDispatch } from "../../store/hooks";
import { fetchAppointmentsBetween } from "../../redux/appointmentsSlice";

export function useAppointmentsFetch(businessId: number | string | undefined | null) {
    const dispatch = useAppDispatch();
    const lastFetchedRangeRef = useRef<{ start: string; end: string; name: string } | null>(null);

    const fetchAppointmentsForRange = useCallback(
        (arg: DatesSetArg, employeeName: string) => {
            const start = dayjs(arg.start).format("YYYY-MM-DD");
            const end = dayjs(arg.end).format("YYYY-MM-DD");

            const isSameRange =
                lastFetchedRangeRef.current?.start === start &&
                lastFetchedRangeRef.current?.end === end &&
                lastFetchedRangeRef.current?.name === employeeName;

            if (isSameRange) return;

            lastFetchedRangeRef.current = { start, end, name: employeeName };

            dispatch(fetchAppointmentsBetween({
                businessId: Number(businessId),
                employeeName,
                startDate: arg.start,
                endDate: arg.end,
            }));
        },
        [dispatch, businessId]
    );

    return { fetchAppointmentsForRange };
}
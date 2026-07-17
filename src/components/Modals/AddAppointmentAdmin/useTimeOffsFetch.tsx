import { useCallback, useRef } from "react";
import dayjs from "dayjs";
import type { DatesSetArg } from "@fullcalendar/core";
import { useAppDispatch } from "../../../store/hooks";
import { fetchTimeOffsBetween } from "../../../redux/timeOffsSlice";

export function useTimeOffsFetch() {
    const dispatch = useAppDispatch();
    const lastFetchedRangeRef = useRef<{
        start: string;
        end: string;
        name: string;
    } | null>(null);

    const fetchTimeOffsForRange = useCallback(
        (arg: DatesSetArg, employeeId: string) => {
            const start = dayjs(arg.start).format("YYYY-MM-DD");
            const end = dayjs(arg.end).format("YYYY-MM-DD");

            const isSameRange =
                lastFetchedRangeRef.current?.start === start &&
                lastFetchedRangeRef.current?.end === end &&
                lastFetchedRangeRef.current?.name === employeeId;

            if (isSameRange) return;

            lastFetchedRangeRef.current = { start, end, name: employeeId };

            dispatch(
                fetchTimeOffsBetween({
                    employeeId,
                    startDate: arg.start,
                    endDate: arg.end,
                }),
            );
        },
        [dispatch],
    );

    return { fetchTimeOffsForRange };
}

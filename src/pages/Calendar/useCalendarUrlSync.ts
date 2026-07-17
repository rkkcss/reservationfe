// hooks/useCalendarUrlSync.ts
import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import type { DatesSetArg } from "@fullcalendar/core";
import type FullCalendar from "@fullcalendar/react";

export const VALID_VIEWS = [
    "dayGridMonth",
    "timeGridWeek",
    "timeGridDay",
] as const;
export type CalendarView = (typeof VALID_VIEWS)[number];

export const DEFAULT_VIEW: CalendarView = "timeGridWeek";
export const DEFAULT_EMPLOYEE = "all";

const isValidView = (v: string | null): v is CalendarView =>
    !!v && (VALID_VIEWS as readonly string[]).includes(v);

export function useCalendarUrlSync(
    calendarRef: RefObject<FullCalendar>,
    onExternalChange: (arg: DatesSetArg, employeeName: string) => void,
) {
    const [searchParams, setSearchParams] = useSearchParams();

    const lastInternalUrlRef = useRef<string | null>(null);

    const urlView: CalendarView = isValidView(searchParams.get("view"))
        ? (searchParams.get("view") as CalendarView)
        : DEFAULT_VIEW;
    const urlDate = searchParams.get("date") ?? dayjs().format("YYYY-MM-DD");
    const urlEmployee = searchParams.get("employeeId") ?? DEFAULT_EMPLOYEE;

    const syncUrlFromCalendar = useCallback(
        (arg: DatesSetArg, employeeId: string) => {
            const view = arg.view.type as CalendarView;
            const date = dayjs(arg.view.currentStart).format("YYYY-MM-DD");

            const next = new URLSearchParams(searchParams);
            next.set("view", view);
            next.set("date", date);
            next.set("employeeId", employeeId);

            const nextString = next.toString();
            lastInternalUrlRef.current = nextString;

            setSearchParams(next, { replace: true });
        },
        [setSearchParams, searchParams],
    );

    useEffect(() => {
        const currentUrlString = searchParams.toString();

        // Ha ez pontosan az az URL, amit mi magunk írtunk ki utoljára -> skip.
        if (lastInternalUrlRef.current === currentUrlString) {
            return;
        }

        const calendarApi = calendarRef.current?.getApi();
        if (!calendarApi) return;

        const currentDate = dayjs(calendarApi.getDate()).format("YYYY-MM-DD");
        const viewOrDateChanged =
            calendarApi.view.type !== urlView || currentDate !== urlDate;

        if (calendarApi.view.type !== urlView) {
            calendarApi.changeView(urlView);
        }
        if (currentDate !== urlDate) {
            calendarApi.gotoDate(urlDate);
        }

        if (!viewOrDateChanged) {
            const view = calendarApi.view;
            onExternalChange(
                {
                    start: view.activeStart,
                    end: view.activeEnd,
                    startStr: view.activeStart.toISOString(),
                    endStr: view.activeEnd.toISOString(),
                    view,
                    timeZone: calendarApi.getOption("timeZone") ?? "local",
                } as DatesSetArg,
                urlEmployee,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlView, urlDate, urlEmployee]);

    return { urlView, urlDate, urlEmployee, syncUrlFromCalendar };
}

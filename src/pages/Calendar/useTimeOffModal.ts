import { useCallback, useState } from "react";
import dayjs from "dayjs";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";

import { useAppDispatch } from "../../store/hooks";
import { CreateTimeOffType, TimeOff } from "../../helpers/types/TimeOff";
import {
    createTimeOffThunk,
    updateTimeOffThunk,
    deleteTimeOffThunk,
} from "../../redux/timeOffsSlice";
import { eventToTimeOff } from "../../services/calendar-service";

export function useTimeOffModal(
    employeeId: number | string | undefined | null,
) {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTimeOff, setSelectedTimeOff] = useState<TimeOff>(
        {} as TimeOff,
    );

    const openForEdit = useCallback((clickInfo: EventClickArg) => {
        setSelectedTimeOff(eventToTimeOff(clickInfo.event));
        setIsOpen(true);
    }, []);

    const openForCreate = useCallback((selectInfo: DateSelectArg) => {
        setSelectedTimeOff({
            startDate: dayjs(selectInfo.start).format("YYYY-MM-DD"),
            endDate: dayjs(selectInfo.end).format("YYYY-MM-DD"),
        } as TimeOff);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setSelectedTimeOff({} as TimeOff);
    }, []);

    const save = useCallback(
        (timeOff: CreateTimeOffType) => {
            if (!timeOff.id) {
                dispatch(
                    createTimeOffThunk({
                        employeeId: Number(employeeId),
                        timeOff,
                    }),
                );
            } else {
                dispatch(
                    updateTimeOffThunk({
                        timeOff,
                    }),
                );
            }
        },
        [dispatch, employeeId],
    );

    const remove = useCallback(
        (timeOffId: number) => {
            if (timeOffId) {
                dispatch(
                    deleteTimeOffThunk({
                        employeeId: Number(employeeId),
                        timeOffId,
                    }),
                );
            }
        },
        [dispatch, employeeId],
    );

    return {
        isOpen,
        selectedTimeOff,
        openForEdit,
        openForCreate,
        close,
        save,
        remove,
    };
}

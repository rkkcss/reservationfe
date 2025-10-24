// src/context/CalendarContext.tsx
import { createContext, useContext, useRef, ReactNode } from "react";
import FullCalendar from "@fullcalendar/react";

type CalendarContextType = {
    calendarRef: React.RefObject<FullCalendar>,
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
    const calendarRef = useRef<FullCalendar>(null);

    return (
        <CalendarContext.Provider value={{ calendarRef }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error("useCalendar must be used within a CalendarProvider");
    }
    return context;
};

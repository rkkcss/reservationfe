import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import { Form, FormInstance } from "antd";

type AppointmentReservationContextType = {
    form: FormInstance;
    isSummaryModalOpen: boolean,
    setIsSummaryModalOpen: Dispatch<SetStateAction<boolean>>
};

const PublicReservationContext = createContext<AppointmentReservationContextType | undefined>(undefined);

export const PublicReservationProvider = ({ children }: { children: ReactNode }) => {
    const [form] = Form.useForm();
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

    return (
        <PublicReservationContext.Provider
            value={{
                form,
                isSummaryModalOpen,
                setIsSummaryModalOpen
            }}
        >
            {children}
        </PublicReservationContext.Provider>
    );
};

export const usePublicReservation = () => {
    const context = useContext(PublicReservationContext);
    if (!context) throw new Error("useCalendar must be used within a CalendarProvider");
    return context;
};

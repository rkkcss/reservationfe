import { Form, Image, Typography } from "antd";
import { ConfigProviderBusinessProvider } from "../../context/ConfigProviderBusinessContext";
import {
    PublicReservationProvider,
    usePublicReservation,
} from "../../context/PublicAppointmentReservation";
import PublicEmployeeChooser from "./PublicEmployeeChooser";
import PublicOfferingChooser from "./PublicOfferingChooser";
import PublicAppointmentChooser from "./PublicAppointmentChooser";
import PublicAppointmentSummary from "./PublicAppointmentSummary";
import { useEffect, useState } from "react";
import { getBusinessBySlugQuery } from "../../helpers/queries/business-queries";
import { useTenantSlug } from "../../hooks/useTenantSlug";
import { Business } from "../../helpers/types/Business";
import PublicAppointmentPersonalDetails from "./PublicAppointmentPersonalDetails";
import PublicAppointmentSummaryModal from "./PublicAppointmentSummaryModal";
import PublicEmployeeImageGallery from "./PublicEmployeeImageGallery";

export default function BusinessPage() {
    const { form, setIsSummaryModalOpen } = usePublicReservation();
    const [business, setBusiness] = useState<Business | null>(null);
    const tenantSlug = useTenantSlug();
    const selectedEmployeeId: number | null = Form.useWatch("employeeId", form);

    const handleFormFinish = () => {
        setIsSummaryModalOpen(true);
    };

    useEffect(() => {
        if (tenantSlug) {
            getBusinessBySlugQuery(tenantSlug).then((res) =>
                setBusiness(res.data),
            );
        }
    }, [tenantSlug]);

    const handleValuesChange = (changedValues: Record<string, unknown>) => {
        if ("employeeId" in changedValues) {
            form.setFieldsValue({ time: null, date: null, offering: null });
            console.log(
                "form values after employeeId reset:",
                form.getFieldsValue(),
            );
        }

        if ("date" in changedValues) {
            form.setFieldsValue({ time: null });
        }

        if ("offering" in changedValues) {
            form.setFieldsValue({ time: null, date: null });
        }
    };

    return (
        <>
            <PublicAppointmentSummaryModal />
            <div className="min-h-dvh overflow-x-hidden">
                <section className="relative h-[550px] w-full">
                    <div className="!absolute !inset-0 w-full h-full">
                        <Image
                            alt="Interior"
                            width={"100vw"}
                            height={"100%"}
                            src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&h=400&q=80"
                        />
                    </div>

                    <div className="absolute inset-0 hero-gradient"></div>
                    <div className="relative h-full container mx-auto pt-16 flex flex-col items-center text-center text-white">
                        <div className="flex items-center gap-2 mb-4 bg-black/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
                            <img
                                alt="Logo"
                                className="h-5 w-5 invert"
                                src="https://lh3.googleusercontent.com/aida/AP1WRLuPrfLaZswjHQRGn7SD5IneQ6Cq9etfbgt4CswvZc6qMyS35IGAn1hA1xBBPJ_3NChkKWk0B-OBJ7ZjD-tDVK89pmai3AS7eg8-UnzhaZsCM9bYepBvZu-pULJ3_1YFLt8_-lMFuUBVWMVS-b6GQIn3FGbWfg9_f9zngsFsYNXyHhxmygumIq7U1K8rE9k8aoFho6xMN_PN8NkHTUeY8qMSapEqRgPrNTpCaeZw-BETRFinAezn6VPTLss"
                            />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">
                                {business?.name}
                            </span>
                        </div>
                        <Typography.Title
                            level={1}
                            className="!text-[48px] leading-tight mb-4 drop-shadow-2xl"
                        >
                            {business?.description}
                        </Typography.Title>
                        {/* <Typography.Paragraph className="text-lg font-medium opacity-90 max-w-xl">Prémium barber élmény és személyre szabott styling Budapest szívében.</Typography.Paragraph> */}
                    </div>
                </section>
                <div className="max-w-screen-xl mx-auto px-4 lg:px-16 -mt-40 relative z-10 w-full mb-12">
                    <Form
                        form={form}
                        onFinish={handleFormFinish}
                        onValuesChange={handleValuesChange}
                        layout="vertical"
                        className="public-appointment-reservation"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col lg:flex-row">
                            <div className="flex-1 p-10 border-b md:border-b-0 md:border-r border-outline-variant space-y-10">
                                <Form.Item
                                    name="employeeId"
                                    className="space-y-4"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Kérjük válasszon szakembert!",
                                        },
                                    ]}
                                    label={
                                        <p className="text-xs font-bold uppercase tracking-widest">
                                            Szakember Kiválósága
                                        </p>
                                    }
                                >
                                    <PublicEmployeeChooser />
                                </Form.Item>
                                <div className="space-y-4">
                                    <Form.Item
                                        name="offering"
                                        label={
                                            <p className="text-xs font-bold uppercase tracking-widest">
                                                Szolgáltatás kiválasztása
                                            </p>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Kérjük válasszon szolgáltatást!",
                                            },
                                        ]}
                                    >
                                        <PublicOfferingChooser />
                                    </Form.Item>
                                </div>
                                <div>
                                    <PublicEmployeeImageGallery
                                        employeeId={selectedEmployeeId}
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-[420px] bg-surface-container-lowest p-10 flex flex-col space-y-8">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-widest">
                                        Időpont
                                    </p>
                                    <PublicAppointmentChooser />
                                </div>
                                <div>
                                    <PublicAppointmentPersonalDetails />
                                </div>
                                <div className="pt-8 border-t border-outline-variant space-y-6">
                                    <PublicAppointmentSummary />
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export const BusinessPageWrap = () => {
    return (
        <PublicReservationProvider>
            <ConfigProviderBusinessProvider>
                <BusinessPage />
            </ConfigProviderBusinessProvider>
        </PublicReservationProvider>
    );
};

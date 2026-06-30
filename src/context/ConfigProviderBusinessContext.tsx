import { createContext, useContext, ReactNode, useEffect, useCallback, useState } from "react";
import { Business } from "../helpers/types/Business";
import { getBusinessBySlugQuery } from "../helpers/queries/business-queries";
import { ConfigProvider, theme } from "antd";
import { MappingAlgorithm } from "antd/es/theme/interface";
import { useTenantSlug } from "../hooks/useTenantSlug";

type CustomTheme = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token: Record<string, any>;
    algorithm?: MappingAlgorithm | MappingAlgorithm[];
};

const themes: Record<string, CustomTheme> = {
    blue: {
        token: { colorPrimary: "#1677ff", colorInfo: "#1677ff" }
    },
    pink: {
        token: { colorPrimary: "#ff4d4f", colorInfo: "#ff4d4f" }
    },
    orange: {
        token: { colorPrimary: "#ffa940", colorInfo: "#ffa940" }
    },
    black: {
        // Ez lesz a teljes sötét mód
        algorithm: theme.darkAlgorithm,
        token: {
            "colorPrimary": "#4f4f4f",
            "colorInfo": "#4f4f4f",

        },
    },
};

type ConfigProviderBusinessContextType = {
    business: Business;
    selectedTheme: CustomTheme;
};

const ConfigProviderBusinessContext = createContext<ConfigProviderBusinessContextType | undefined>(undefined);

export const ConfigProviderBusinessProvider = ({ children }: { children: ReactNode }) => {
    const tenantSlug = useTenantSlug();
    const [business, setBusiness] = useState<Business>({} as Business);

    if (!tenantSlug) throw new Error("tenantSlug is required in URL params");

    const getBusinessBySlug = useCallback(() => {
        getBusinessBySlugQuery(tenantSlug).then(res => setBusiness(res.data));
    }, [tenantSlug]);

    useEffect(() => {
        getBusinessBySlug();
    }, [getBusinessBySlug]);

    const normalizedTheme = (business.theme || 'pink').toLowerCase();
    const selectedTheme = themes[normalizedTheme] || themes['pink'];
    console.log("selectedTheme.token", selectedTheme.token)
    return (
        <ConfigProviderBusinessContext.Provider value={{ business, selectedTheme }}>
            <ConfigProvider
                theme={{
                    token: selectedTheme.token,
                }}
            >
                {children}
            </ConfigProvider>
        </ConfigProviderBusinessContext.Provider>
    );
};

export const useBusinessConfigProvider = () => {
    const context = useContext(ConfigProviderBusinessContext);
    if (!context) throw new Error("useBusinessConfigProvider must be used within a ConfigProviderBusinessProvider");
    return context;
};
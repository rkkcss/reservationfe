import { createContext, useContext, ReactNode, useEffect, useCallback, useState } from "react";
import { useParams } from "react-router";
import { Business } from "../helpers/types/Business";
import { getBusiness } from "../helpers/queries/business-queries";
import { ConfigProvider } from "antd";
import { AliasToken } from "antd/es/theme/internal";

type CustomTheme = {
    selectorBg: string;
    token: Partial<AliasToken>;
    background: string;
    backgroundColor: string;
    headerText1Color: string;
    pTextColor: string;
    borderColor: string;
    cardBgColor: string;
    primaryTextColor: string;
    secondaryTextColor: string;
    primaryButtonColor: string;
    primaryButtonTextColor: string;
    primaryButtonColorHover: string;
    secondaryButtonColor: string;
    secondaryButtonTextColor: string;
    optionActiveBg: string;
    optionSelectedBg: string;
};

const themes: Record<string, CustomTheme> = {
    blue: {
        token: {
            colorPrimary: '#1e90ff',
            colorBgContainer: 'transparent',
            colorText: '#64748b', // selectedTheme.secondaryTextColor megfelelője
            colorBgElevated: '#ffffff', // a lenyíló lista háttere kék témánál fehér
        },
        selectorBg: '#ffffff',
        optionActiveBg: '#e6f7ff', // finom kék hover a listában
        optionSelectedBg: '#bae7ff', // erősebb kék kijelölés a listában
        backgroundColor: '#f0f2f5',
        background: 'bg-gradient-to-br from-sky-300 via-blue-200 to-cyan-300',
        headerText1Color: "#002c6d",
        pTextColor: "#334155",
        borderColor: "#cbd5e1",
        cardBgColor: "#ffffff",
        primaryTextColor: "#1e293b",
        secondaryTextColor: "#64748b",
        primaryButtonColor: "#1e90ff",
        primaryButtonTextColor: "#fff",
        primaryButtonColorHover: "#187bcd",
        secondaryButtonColor: "#ffffff",
        secondaryButtonTextColor: "#1e90ff",
    },
    pink: {
        token: {
            colorPrimary: '#d63384',
            colorBgContainer: 'transparent',
            colorText: '#6b21a8', // selectedTheme.secondaryTextColor megfelelője
            colorBgElevated: '#ffffff',
        },
        selectorBg: '#ffffff',
        optionActiveBg: '#fce4ec', // finom pink hover a listában
        optionSelectedBg: '#f8bbd0', // erősebb pink kijelölés a listában
        backgroundColor: '#fce4ec',
        background: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400',
        headerText1Color: "#4a0033",
        pTextColor: "#4f46e5",
        borderColor: "#f9a8d4",
        cardBgColor: "rgba(255, 255, 255, 0.8)",
        primaryTextColor: "#2e0854",
        secondaryTextColor: "#6b21a8",
        primaryButtonColor: "#d63384",
        primaryButtonTextColor: "#fff",
        primaryButtonColorHover: "#b8266e",
        secondaryButtonColor: "#f2f2f2",
        secondaryButtonTextColor: "#212121",
    },
    black: {
        token: {
            colorPrimary: '#E2E5E9',
            colorBgContainer: '#262626',      // Az input mezők belső sötét háttere
            colorBgElevated: '#1d1d1f',       // A Modal fő háttere (ez már jó a képeden)
            colorText: '#ffffff',             // Fő szövegszínek
            colorTextHeading: '#ffffff',      // Modal címe és aktív lépések címe

            // --- ÚJ FIXEK A KÉP ALAPJÁN ---
            colorTextDescription: '#e5e7eb',  // A Steps (lépésjelző) szövegeinek a színe
            colorTextDisabled: '#6b7280',     // Az inaktív lépések számai (2, 3, 4) és vonalai láthatóbbak lesznek
            colorTextPlaceholder: '#6b7280',  // Az Input mezők placeholder szövege ("Vendég neve...")
            colorIcon: '#A0A5AD',             // A Modal bezáró (X) gombjának a színe
            colorIconHover: '#ffffff',        // Bezáró gomb hover színe
            colorTextQuaternary: '#4b5563',   // EZ A LÉNYEG: az inaktív lépések számai (3, 4) és a köztük lévő vonalak színe
            colorTextTertiary: '#9ca3af',
        },
        // Közvetlenül a gyökérben lévő dropdown kulcsaid:
        selectorBg: '#262626',
        optionActiveBg: '#3f3f46',
        optionSelectedBg: '#4b5563',

        backgroundColor: '#141414',
        background: 'bg-gradient-to-br from-gray-900 via-purple-950 to-black',
        headerText1Color: "#ffffff",
        pTextColor: "#E2E5E9",
        borderColor: "rgba(255, 255, 255, 0.15)",
        cardBgColor: "#1d1d1f",
        primaryTextColor: "#ffffff",
        secondaryTextColor: "#A0A5AD",
        primaryButtonColor: "#262626",
        primaryButtonTextColor: "#E2E5E9",
        primaryButtonColorHover: "#3f3f46",
        secondaryButtonColor: "rgba(255, 255, 255, 0.08)",
        secondaryButtonTextColor: "#E2E5E9",
    },
    orange: {
        token: {
            colorPrimary: '#fa8c16',
            colorBgContainer: 'transparent',
            colorText: '#8c8c8c', // selectedTheme.secondaryTextColor megfelelője
            colorBgElevated: '#ffffff',
        },
        selectorBg: '#ffffff',
        optionActiveBg: '#fff7e6', // finom narancs hover a listában
        optionSelectedBg: '#ffe7ba', // erősebb narancs kijelölés a listában

        backgroundColor: '#fff7e6',
        background: 'bg-gradient-to-br from-orange-400 via-yellow-300 to-pink-300',
        headerText1Color: "#612500",
        pTextColor: "#434343",
        borderColor: "#ffd591",
        cardBgColor: "#ffffff",
        primaryTextColor: "#262626",
        secondaryTextColor: "#8c8c8c",
        primaryButtonColor: "#fa8c16",
        primaryButtonTextColor: "#fff",
        primaryButtonColorHover: "#d46b08",
        secondaryButtonColor: "#ffffff",
        secondaryButtonTextColor: "#fa8c16",
    },
};
type ConfigProviderBusinessContextType = {
    business: Business;
    selectedTheme: CustomTheme;
};

const ConfigProviderBusinessContext = createContext<ConfigProviderBusinessContextType | undefined>(undefined);

export const ConfigProviderBusinessProvider = ({ children }: { children: ReactNode }) => {
    const { businessId } = useParams();
    if (!businessId) throw new Error("businessId is required in URL params");

    const [business, setBusiness] = useState<Business>({} as Business);

    const getBusinessById = useCallback(() => {
        // Fetch business details by ID
        getBusiness(businessId)
            .then(res => setBusiness(res.data));
    }, [businessId]);

    useEffect(() => {
        getBusinessById();
    }, [getBusinessById]);

    const normalizedTheme = (business.theme || 'default').toLowerCase();
    const selectedTheme = themes[normalizedTheme] || themes['pink'];

    return (
        <ConfigProviderBusinessContext.Provider
            value={{
                business,
                selectedTheme
            }}

        >
            <ConfigProvider
                theme={{
                    token: selectedTheme.token,
                    components: {
                        Layout: {
                            colorBgBody: selectedTheme.token.colorBgContainer,
                        },
                        Typography: {
                            colorText: selectedTheme.token.colorText,
                        },
                        Tabs: {
                            colorBgContainer: selectedTheme.token.colorBgContainer,
                            colorText: selectedTheme.token.colorText,
                            colorPrimary: selectedTheme.token.colorPrimary,
                            colorBorderSecondary: selectedTheme.token.colorPrimary,
                            fontWeightStrong: 600,
                            itemColor: selectedTheme.secondaryButtonTextColor,
                            itemHoverColor: selectedTheme.secondaryButtonTextColor,
                            itemActiveColor: selectedTheme.primaryTextColor,
                        },
                        Collapse: {
                            colorBgContainer: selectedTheme.token.colorBgContainer,
                            colorText: selectedTheme.token.colorText,
                            colorBorder: selectedTheme.borderColor,
                            fontWeightStrong: 600,
                            colorIcon: selectedTheme.primaryTextColor,
                        },
                        Card: {
                            colorBgContainer: "transparent",
                            colorBorderSecondary: selectedTheme.borderColor,

                        },
                        Dropdown: {
                            colorBgTextActive: "yellow"
                        },
                        Select: {
                            colorBgContainer: selectedTheme.token.colorBgContainer,
                            colorPrimary: selectedTheme.token.colorText,
                            colorText: selectedTheme.secondaryTextColor,
                            selectorBg: selectedTheme.selectorBg,
                            optionActiveBg: selectedTheme.optionActiveBg,
                            optionSelectedBg: selectedTheme.optionSelectedBg,
                        },
                        Button: {
                            //default button
                            defaultColor: selectedTheme.secondaryButtonTextColor,
                            defaultActiveBorderColor: selectedTheme.secondaryButtonTextColor,
                            defaultHoverBorderColor: selectedTheme.secondaryButtonTextColor,
                            defaultHoverColor: selectedTheme.secondaryButtonTextColor,
                            colorBorder: "transparent",
                            colorBgContainer: selectedTheme.secondaryButtonColor,
                            defaultBorderColor: "transparent",
                            //primary
                            colorPrimary: selectedTheme.primaryButtonColor,
                            colorPrimaryHover: selectedTheme.primaryButtonColorHover,
                            colorPrimaryActive: selectedTheme.primaryButtonColor,
                            colorPrimaryBorderHover: "yellow",
                        },
                    }
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

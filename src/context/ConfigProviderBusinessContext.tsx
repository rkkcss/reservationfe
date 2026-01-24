import { createContext, useContext, ReactNode, useEffect, useCallback, useState } from "react";
import { useParams } from "react-router";
import { Business } from "../helpers/types/Business";
import { getBusiness } from "../helpers/queries/business-queries";
import { ConfigProvider } from "antd";
import { AliasToken } from "antd/es/theme/internal";

type CustomTheme = {
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
    secondaryButtonColor: string;
    secondaryButtonTextColor: string;
};

const themes: Record<string, CustomTheme> = {
    blue: {
        token: {
            colorPrimary: '#1e90ff',
        },
        backgroundColor: '#f0f2f5',
        background: 'bg-gradient-to-br from-sky-300 via-blue-200 to-cyan-300',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "",
        cardBgColor: "",
        primaryTextColor: "",
        secondaryTextColor: "",
        primaryButtonColor: "#1e90ff",
        primaryButtonTextColor: "#fff",
        secondaryButtonColor: "#1e90ff",
        secondaryButtonTextColor: "#fff",
    },
    pink: {
        token: {
            colorPrimary: '#d63384',
        },
        backgroundColor: '#fce4ec',
        background: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "border-pink-300",
        cardBgColor: "",
        primaryTextColor: "",
        secondaryTextColor: "",
        primaryButtonColor: "#d63384",
        primaryButtonTextColor: "#fff",
        secondaryButtonColor: "#f2f2f2",
        secondaryButtonTextColor: "#212121",
    },
    black: {
        token: {
            colorPrimary: '#E2E5E9',
        },
        backgroundColor: '#1f1f1f',
        background: 'bg-gradient-to-br from-gray-800 via-purple-800 to-black',
        headerText1Color: "",
        pTextColor: "#E2E5E9",
        borderColor: "transparent",
        cardBgColor: "#333334",
        primaryTextColor: "#E2E5E9",
        secondaryTextColor: "#B0B3B8",
        primaryButtonColor: "#1f1f1f",
        primaryButtonTextColor: "#E2E5E9",
        secondaryButtonColor: "rgba(252, 252, 252, 0.2)",
        secondaryButtonTextColor: "#fcfcfc",
    },
    orange: {
        token: {
            colorPrimary: '#fa8c16',
        },
        backgroundColor: '#fff7e6',
        background: 'bg-gradient-to-br from-orange-400 via-yellow-300 to-pink-300',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "border-orange-400",
        cardBgColor: "",
        primaryTextColor: "",
        secondaryTextColor: "",
        primaryButtonColor: "#fa8c16",
        primaryButtonTextColor: "#fff",
        secondaryButtonColor: "#fa8c16",
        secondaryButtonTextColor: "#fff",
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
                            // colorBgContainer: "transparent",
                            // colorPrimary: "yellow",
                            // colorText: selectedTheme.secondaryTextColor,
                            // // selectorBg: "black",
                            // optionActiveBg: "yellow",
                            // optionSelectedBg: "black",
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
                            colorPrimaryHover: selectedTheme.primaryButtonColor,
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

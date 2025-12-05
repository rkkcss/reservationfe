import { ConfigProvider, Tabs } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { getBusiness } from '../helpers/queries/business-queries'
import { useParams } from 'react-router'
import BusinessServices from '../components/BusinessServices'
import { DAY_OF_WEEK } from '../helpers/types/OpeningHour'
import { Business } from '../helpers/types/Business'
import BusinessRatings from '../components/BusinessRatings'
import { AliasToken } from 'antd/es/theme/internal'
import placeholderImage from '../assets/placeholder.jpg'

type CustomTheme = {
    token: Partial<AliasToken>;
    background: string;
    backgroundColor: string;
    headerText1Color: string;
    pTextColor: string;
    borderColor: string
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
        borderColor: ""
    },
    pink: {
        token: {
            colorPrimary: '#d63384',
        },
        backgroundColor: '#fce4ec',
        background: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "border-pink-300"
    },
    black: {
        token: {
            colorPrimary: '#1f1e1d',
        },
        backgroundColor: '#121212',
        background: 'bg-gradient-to-br from-gray-800 via-purple-800 to-black',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "transparent"
    },
    orange: {
        token: {
            colorPrimary: '#fa8c16',
        },
        backgroundColor: '#fff7e6',
        background: 'bg-gradient-to-br from-orange-400 via-yellow-300 to-pink-300',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "border-orange-400"
    },
};


const BusinessPage = () => {
    const { businessId } = useParams();
    const [business, setBusiness] = useState<Business>({} as Business);


    const normalizedTheme = (business.theme || 'pink').toLowerCase();
    const selectedTheme = themes[normalizedTheme] || themes['pink'];

    const getBusinessById = useCallback(() => {
        if (!businessId) return;
        // Fetch business details by ID
        getBusiness(businessId)
            .then(res => setBusiness(res.data));
    }, [businessId]);

    useEffect(() => {
        getBusinessById();
    }, [getBusinessById]);

    const tabValues = [
        {
            key: "services",
            label: "Szolgáltatások",
            children: <BusinessServices />
        },
        {
            key: "reviews",
            label: "Vélemények",
            children: <BusinessRatings />
        },
        {
            key: "gallery",
            label: "Galéria",
            children: <div className="text-center">Galéria funkció még nem elérhető.</div>
        }
    ]



    return (
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
                    },
                    Collapse: {
                        colorBgContainer: selectedTheme.token.colorBgContainer,
                        colorText: selectedTheme.token.colorText,
                        colorBorder: selectedTheme.borderColor,
                        fontWeightStrong: 600,
                    },
                    Card: {
                        colorBgContainer: "transparent",
                        colorBorderSecondary: selectedTheme.borderColor,

                    },
                    Dropdown: {
                        colorBgTextActive: "yellow"
                    }
                }
            }}
        >
            <div className={`min-h-svh flex items-start bg-[${selectedTheme.backgroundColor}] overflow-hidden`}>
                <div className={`${selectedTheme.background} absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full  opacity-50 blur-[150px] z-0`} />
                <div className="text-custom-gray container mx-auto max-w-[1240px] p-5 backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg mt-4 rounded-xl">
                    <h1 className="text-3xl mt-4 mb-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">{business.name}</h1>

                    {
                        business.logo &&
                        <div className="mb-4">
                            <img className="w-full h-[40vh] object-cover rounded-lg" src={business.logo}
                                alt=""
                                onError={e => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = placeholderImage;
                                }}
                            />
                        </div>
                    }


                    <div className="flex flex-col md:flex-row gap-5 w-full">
                        <div>
                            <div className={`border ${selectedTheme.borderColor} py-1 px-3 max-w-96 rounded-lg min-w-[300px]`}>
                                {
                                    business.address &&
                                    <>
                                        <p className="leading-10">Cím:</p>
                                        <p className="text-xs leading-5">
                                            {business.address}
                                        </p>
                                    </>
                                }
                                {
                                    business.phoneNumber &&
                                    <>
                                        <p className="leading-10">Telefon:</p>
                                        <p className="text-xs leading-5 ">
                                            {business.phoneNumber}
                                        </p>
                                    </>
                                }
                                {
                                    business.description &&
                                    <>
                                        <p className="leading-10">Leírás:</p>
                                        <p className="text-xs leading-5 ">
                                            {business.description}
                                        </p>
                                    </>
                                }

                                {
                                    business.workingHours &&
                                    <p className="leading-10">Nyitvatartás:</p>
                                }
                                {
                                    business.workingHours &&
                                    business.workingHours.map(day => (
                                        <p key={day.dayOfWeek} className="text-xs leading-5 text-slate-500">
                                            {day.dayOfWeek && DAY_OF_WEEK[day.dayOfWeek]}: {day.startTime} - {day.endTime}
                                        </p>
                                    ))
                                }

                            </div>
                        </div>
                        <Tabs items={tabValues} className=" flex-grow" />
                    </div>
                </div>
            </div>
        </ConfigProvider>
    )
}

export default BusinessPage
import { ConfigProvider, Tabs } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { getBusiness } from '../helpers/queries/businessService'
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
    headerText1Color: string;
    pTextColor: string;
    borderColor: string
};

const themes: Record<string, CustomTheme> = {
    blue: {
        token: {
            colorPrimary: '#1e90ff',
        },
        background: 'bg-[radial-gradient(circle,_rgba(230,247,255,1)_0%,_rgba(0,122,204,1)_100%)]',
        headerText1Color: "",
        pTextColor: "",
        borderColor: ""
    },
    pink: {
        token: {
            colorPrimary: '#d63384',
        },
        background: 'bg-[radial-gradient(circle,_rgba(252,240,240,1)_0%,_rgba(247,151,206,1)_100%)]',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "border-pink-300"
    },
    black: {
        token: {
            colorPrimary: '#dedede',
        },
        background: 'bg-[radial-gradient(circle,_rgba(33,8,8,1)_0%,_rgba(59,53,54,1)_100%)]',
        headerText1Color: "",
        pTextColor: "",
        borderColor: "color-pink-500"
    },
    orange: {
        token: {
            colorPrimary: '#fa8c16',
        },
        background: 'bg-gradient-to-r from-orange-100 via-orange-300 to-orange-500',
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
            children: <BusinessServices selectedTheme={selectedTheme} />
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
                }
            }}
        >
            <div className={`min-h-svh flex items-start ${selectedTheme.background}`}>
                <div className="text-custom-gray container mx-auto max-w-[1240px] p-5 bg-pink-100/50 backdrop-blur-xl mt-4 rounded-xl">
                    <h1 className="text-3xl mt-4 mb-2">{business.name}</h1>

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
                            <div className={`border-2 ${selectedTheme.borderColor} py-1 px-3 max-w-96 rounded-lg min-w-[300px]`}>
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
import { Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { getBusiness } from '../helpers/queries/businessService'
import { useParams } from 'react-router'
import BusinessServices from '../components/BusinessServices'
import { DAY_OF_WEEK } from '../helpers/types/OpeningHour'
import { Business } from '../helpers/types/Business'
import BusinessRatings from '../components/BusinessRatings'

const BusinessPage = () => {
    const { businessId } = useParams();
    const [business, setBusiness] = useState<Business>({})

    useEffect(() => {
        if (businessId) {
            getBusiness(businessId)
                .then(res => setBusiness(res.data))
        }
    }, [businessId]);

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
        }
    ]
    return (
        <div className="text-custom-gray container mx-auto max-w-[800px] min-h-svh">
            <h1 className="text-3xl my-7">{business.name}</h1>
            <div>
                <div className="border-2 border-slate-200 py-1 px-3 max-w-96 rounded-lg">
                    {
                        business.address &&
                        <>
                            <p className="leading-10">Cím:</p>
                            <p className="text-xs leading-5 text-slate-500">
                                {business.address}
                            </p>
                        </>
                    }
                    {
                        business.phoneNumber &&
                        <>
                            <p className="leading-10">Telefon:</p>
                            <p className="text-xs leading-5 text-slate-500">
                                {business.phoneNumber}
                            </p>
                        </>
                    }
                    {
                        business.description &&
                        <>
                            <p className="leading-10">Leírás:</p>
                            <p className="text-xs leading-5 text-slate-500">
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
                <Tabs items={tabValues} className="mt-8" />
            </div>
        </div>
    )
}

export default BusinessPage
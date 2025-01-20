import { DatePicker, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { getBusiness } from '../helpers/queries/businessService'
import { useParams } from 'react-router'
import BusinessWorkers from '../components/BusinessWorkers'
import BusinessServices from '../components/BusinessServices'
import { DAY_OF_WEEK } from '../helpers/types/OpeningHour'
import { Business } from '../helpers/types/Business'

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
            key: "employees",
            label: "Szakemberek",
            children: <BusinessWorkers />
        }
    ]
    return (
        <>
            <h1 className="text-3xl">Kis Andi fodrásszalon</h1>
            <div>
                <div className="border-2 border-slate-200 py-1 px-3 max-w-96 min-w-96 rounded-lg">
                    <p className="leading-10">Cím:</p>
                    <p className="text-xs leading-5 text-slate-500">1116 Budapest, XI. kerület
                        Alíz utca 6/b, A épület földszint 8.
                    </p>
                    <p className="leading-10">Leírás:</p>
                    <p className="text-xs leading-5 text-slate-500">Jelentkezz be hozzánk hajgyógyászati Oxigénterápiára, ha egészséges bőrt, fejbőrt és gyöngyörű hajat szeretnél. Az Oxigénterápia megoldást nyújt a bőr és fejbőrproblémákra, hajhullásra, zsíros-száraz-korpás fejbőrre. Ha szeretnél megszabadulni ezektől a problémáktól, jó helyen jársz. Foglalj online időpontot. </p>
                    <p className="leading-10">Nyitvatartás:</p>
                    {
                        business.openingHours &&
                        business.openingHours.map(day => (
                            <p key={day.dayOfWeek} className="text-xs leading-5 text-slate-500">
                                {day.dayOfWeek && DAY_OF_WEEK[day.dayOfWeek]}: {day.openTime} - {day.closeTime}
                            </p>
                        ))
                    }
                </div>
                <Tabs items={tabValues} />
            </div>
            {/* <DatePicker placeholder="Válassz dátumot" /> */}
        </>
    )
}

export default BusinessPage
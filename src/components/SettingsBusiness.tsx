
import { Button, Tabs } from 'antd'
import SettingsBusinessData from './SettingsBusinessData'
import { useCallback, useEffect, useState } from 'react'
import { getBusinessByLoggedInUser } from '../helpers/queries/business-queries'
import { Business } from '../helpers/types/Business'
import SettingsCoverImage from './SettingsCoverImage'
import SettingsThemeSelector from './SettingsThemeSelector'
import { useAppSelector } from '../store/hooks'
import BusinessOpeningHours from './BusinessOpeningHours/BusinessOpeningHours'

const SettingsBusiness = () => {
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const [business, setBusiness] = useState<Business>({} as Business);

    useEffect(() => {
        if (selectedBusinessEmployee) {
            getBusinessByLoggedInUser(Number(selectedBusinessEmployee?.business.id))
                .then(res => {
                    setBusiness(res.data);
                });
        }

    }, [])

    const setBusinessLogo = useCallback((logo: string) => {
        setBusiness(prev => {
            return { ...prev, logo: logo }
        })
    }, [])

    const setBusinessTheme = useCallback((theme: string) => {
        setBusiness(prev => {
            return { ...prev, theme: theme }
        })
    }, [])

    const tabItems = [
        {
            key: "1",
            label: "Megjelenés",
            children: <>
                <SettingsCoverImage imageURL={business.logo} setBusinessLogo={setBusinessLogo} />
                <SettingsThemeSelector setBusinessTheme={setBusinessTheme} theme={business.theme} />
            </>

        },
        {
            key: "2",
            label: "Üzlet adatok",
            children: <SettingsBusinessData business={business} />
        },
        {
            key: "3",
            label: "Üzlet nyitvatartás",
            children: <BusinessOpeningHours />
        }
    ]

    return (
        <div className="w-full pl-5 mt-5">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Üzlet adatai beállítása</h1>
                <Button onClick={() => window.open(`/business/${business.id}`, '_blank')}>Előnézet megtekintése</Button>
            </div>
            <Tabs items={tabItems} />
        </div>
    )
}

export default SettingsBusiness
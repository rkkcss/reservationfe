
import { Tabs } from 'antd'
import SettingsBusinessData from './SettingsBusinessData'
import { useCallback, useEffect, useState } from 'react'
import { getBusinessByLoggedInUser } from '../helpers/queries/businessService'
import { Business } from '../helpers/types/Business'
import SettingsCoverImage from './SettingsCoverImage'
import SettingsThemeSelector from './SettingsThemeSelector'

const SettingsBusiness = () => {

    const [business, setBusiness] = useState<Business>({} as Business);

    useEffect(() => {
        getBusinessByLoggedInUser()
            .then(res => {
                setBusiness(res.data);
            });
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
        }
    ]

    return (
        <div className="w-full pl-5 mt-5">
            <h1 className="text-2xl font-bold mb-4">Üzlet adatai beállítása</h1>
            <Tabs items={tabItems} />
        </div>
    )
}

export default SettingsBusiness
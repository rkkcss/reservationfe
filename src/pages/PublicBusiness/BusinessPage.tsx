import { Button, Image, Tabs } from 'antd'
import BusinessServices from './BusinessServices'
import BusinessRatings from './BusinessRatings'
import placeholderImage from '../../assets/placeholder.jpg'
import { BiShare, BiStar } from 'react-icons/bi'
import { ConfigProviderBusinessProvider, useBusinessConfigProvider } from '../../context/ConfigProviderBusinessContext'
import BusinessContact from './BusinessContact'

export default function BusinessPage() {
    const { business, selectedTheme } = useBusinessConfigProvider();

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
        <div className={`min-h-svh flex items-start overflow-hidden`} style={{ background: selectedTheme.backgroundColor }}>
            <div className="text-custom-gray container mx-auto max-w-[1240px] p-5 mt-4">

                <div className="mb-4 bg-white rounded-lg shadow-md"
                    style={{ background: selectedTheme.cardBgColor }}
                >
                    <Image rootClassName="w-full" className="!h-[20vh] !object-cover "
                        preview={false}
                        fallback={placeholderImage} src={business.logo}
                        alt=""
                        onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = placeholderImage;
                        }}
                    />
                    <div className="flex gap-2 px-5 pt-2">
                        <div className="">
                            <Image src={business.logo} fallback={placeholderImage} onError={e => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = placeholderImage;
                            }}
                                preview={false}
                                className="-top-5 relative !w-24 !h-24 !min-w-24 !min-h-24 !border-2 border-white rounded-lg" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div>
                                <p className="text-3xl mb-1" style={{ color: selectedTheme.primaryTextColor }}>{business.name}</p>
                                <p className="text-gray-600 text-base mb-2" style={{ color: selectedTheme.secondaryTextColor }}>{business.description}</p>
                                <div className="text-yellow-400 flex items-center">
                                    <BiStar />
                                    <p className="mr-2 font-bold">4.5</p>
                                    <span className="text-gray-600" style={{ color: selectedTheme.secondaryTextColor }}>(129 értékelés)</span>
                                </div>
                            </div>
                            <div className="my-auto">
                                <Button icon={<BiShare />}>Megosztás</Button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col md:flex-row gap-5 w-full">
                    <BusinessContact />
                    <div className="rounded-lg flex-1 px-3"
                        style={{ background: selectedTheme.cardBgColor }}
                    >
                        <Tabs items={tabValues} className=" flex-grow" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BusinessPageWrap = () => {
    return (
        <ConfigProviderBusinessProvider>
            <BusinessPage />
        </ConfigProviderBusinessProvider>
    )
}
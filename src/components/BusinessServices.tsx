import { Button, Collapse, Select, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Offering } from '../helpers/types/Offering'
import { CiClock2 } from 'react-icons/ci'
import { usePagination } from '../hooks/usePagination'
import AddAppointmentSteps from './MultistepForms/AddAppointment/AddAppointmentSteps'
import CustomPagination from './CustomPagination'

const BusinessServices = () => {
    const { businessId } = useParams();
    const { data, totalItems, fetchNextPage, fetchPage, fetchPrevPage, currentPage, itemsPerPage } = usePagination<Offering>(`/api/offerings/business/${businessId}`, 5)
    const [selectedOffer, setSelectedOffer] = useState<Offering>({} as Offering);
    const [addAppointmentModal, setAddAppointmentModal] = useState(false);

    useEffect(() => {
    }, []);

    const handleAppointmentModal = (e: React.MouseEvent, offer: Offering) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedOffer(offer);
        setAddAppointmentModal(true);
    }

    return (
        <>
            <AddAppointmentSteps
                offer={selectedOffer}
                open={addAppointmentModal}
                onClose={() => setAddAppointmentModal(false)}
                key={selectedOffer.id || 'new'}
                businessId={Number(businessId)}
            />
            <div className="">
                {data?.length === 0 ? (
                    <div className="w-full mt-4 text-center text-xl">Nincsenek szolgáltatások!</div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex-col flex">
                                <label>Szűrés</label>
                                <Select
                                    placeholder="Filter..."
                                    className="w-64"

                                />
                            </div>
                            <div className="self-end">
                                <p className="text-gray-700 font-semibold text-base">{totalItems} szolgáltatás</p>
                            </div>
                        </div>
                        {data?.map((offer, index) => (
                            <Collapse
                                key={index}
                                bordered={false}
                                className="mb-5 outline outline-1 outline-persian-indigo-200"
                            >
                                <Collapse.Panel
                                    key={index}
                                    header={offer.title}
                                    extra={
                                        <div className="flex items-center gap-5">
                                            <Tooltip
                                                title="Szolgáltatás időtartama"
                                                className="flex items-center gap-2 h-full"
                                            >
                                                <CiClock2 strokeWidth={1} size={16} />
                                                <span>{offer.durationMinutes} perc</span>
                                            </Tooltip>
                                            <div className="text-slate-600 font-bold flex items-baseline">
                                                {offer.price?.toFixed(0)} Ft
                                            </div>
                                            <Button
                                                type="primary"
                                                onClick={(e) => handleAppointmentModal(e, offer)}
                                            >
                                                Foglalás
                                            </Button>
                                        </div>
                                    }
                                >
                                    <p className="text-xs">{offer.description}</p>
                                </Collapse.Panel>
                            </Collapse>
                        ))}
                        <CustomPagination
                            currentPage={currentPage}
                            fetchNextPage={fetchNextPage}
                            fetchPage={fetchPage}
                            fetchPrevPage={fetchPrevPage}
                            totalItems={totalItems}
                            pageSize={itemsPerPage}
                        />
                    </>
                )}

            </div>
        </>
    )
}

export default BusinessServices
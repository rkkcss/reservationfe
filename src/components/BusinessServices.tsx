import { Button, Collapse, Pagination, Select, Spin, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Offering } from '../helpers/types/Offering'
import { CiClock2 } from 'react-icons/ci'
import { usePagination } from '../hooks/usePagination'
import AddAppointment from './Modals/AddAppointment'
import AddAppointmentSteps from './MultistepForms/AddAppointment/AddAppointmentSteps'

const BusinessServices = () => {
    const { businessId } = useParams();
    const { data, loading, error, totalItems } = usePagination<Offering>(`/api/offerings/business/${businessId}`)
    const [selectedOffer, setSelectedOffer] = useState<Offering>({} as Offering);
    const [addAppointmentModal, setAddAppointmentModal] = useState(false);
    const [reservingModal, setReservingModal] = useState(false);

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
            <AddAppointment open={reservingModal} onClose={() => setReservingModal(false)} onOk={() => console.log("asd")} />
            <div className="">
                {data?.length === 0 ? (
                    <div className="w-full mt-4 text-center text-xl">Nincsenek szolgáltatások!</div>
                ) : (
                    <>
                        <div className="flex flex-col mb-5">
                            <label>Szűrés</label>
                            <Select
                                placeholder="Filter..."
                                className="w-fit"

                            />
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
                                            <div className="text-slate-600 font-bold">
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
                        <Pagination total={totalItems} />
                    </>
                )}

            </div>
        </>
    )
}

export default BusinessServices
import { Button, Collapse, Pagination, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getOffersByBusinessId } from '../helpers/queries/offeringService'
import { useParams } from 'react-router'
import { Offering } from '../helpers/types/Offering'
import { Pageable } from '../helpers/types/Pageable'
import { PaginationInfo } from '../helpers/types/PaginationInfo'
import { CiClock2 } from 'react-icons/ci'

const BusinessServices = () => {
    const { businessId } = useParams();
    const [offers, setOffers] = useState<Offering[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({});

    useEffect(() => {
        if (businessId) {
            getOffersByBusinessId(businessId)
                .then((res: Pageable<Offering>) => {
                    setOffers(res.content);
                    setPaginationInfo(res);
                });
        }

    }, [])

    return (
        <div className="">
            {offers.length === 0 ? (
                <div className="w-full mt-4 text-center text-xl">Nincsenek szolgáltatások!</div>
            ) : (
                <>
                    {offers.map((offer, index) => (
                        <Collapse
                            key={index}
                            bordered={false}
                            className="mb-5 outline outline-1 outline-persian-indigo-200"
                        >
                            <Collapse.Panel
                                key={index}
                                header={offer.name}
                                extra={
                                    <div className="flex items-center gap-5">
                                        <Tooltip
                                            title="Kezelés időtartama"
                                            className="flex items-center gap-2 h-full"
                                        >
                                            <CiClock2 strokeWidth={1} size={16} />
                                            <span>{offer.duration} perc</span>
                                        </Tooltip>
                                        <div className="text-slate-600 font-bold">
                                            {offer.price?.toFixed(0)} Ft
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={(e) => e.stopPropagation()}
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
                    <Pagination total={paginationInfo.totalElements} />
                </>
            )}

        </div>
    )
}

export default BusinessServices
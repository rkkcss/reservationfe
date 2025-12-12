import { useMemo, useState } from 'react'
import { usePagination } from '../hooks/usePagination'
import { Button, Pagination, Spin, } from 'antd'
import EditOffering from '../components/Modals/EditOffering'
import { FiPlus } from 'react-icons/fi'
import { Offering } from '../helpers/types/Offering'
import { createOffer, deleteOffer, updateOffer } from '../helpers/queries/offering-queries'
import { PaginationProps } from 'antd/lib'
import { PiPlusBold } from 'react-icons/pi'
import { UserStore } from '../store/store'
import { useSelector } from 'react-redux'
import { BUSINESS_PERMISSIONS } from '../helpers/types/BusinessPermission'
import SettingsServicesCard from '../components/SettingsServicesCard'


const SettingsMyServices = () => {
    const [editOfferingModal, setEditOfferingModal] = useState(false);
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const { data, setData, totalItems, currentPage, fetchNextPage, fetchPrevPage, fetchPage, loading } = usePagination<Offering>(`/api/offerings/business/${selectedBusinessEmployee?.business?.id}/my`)
    const [editOffer, setEditOffer] = useState<Offering>({} as Offering);

    const userHasPermission = useMemo(() => selectedBusinessEmployee?.permissions?.includes(BUSINESS_PERMISSIONS.EDIT_OWN_SERVICES), [selectedBusinessEmployee]);
    const handleEditOffer = (offer: Offering) => {
        setEditOffer(offer);
        setEditOfferingModal(true);
    }

    const handleCloseEditModal = () => {
        setEditOfferingModal(false);
        setEditOffer({} as Offering);
    }

    const handleOnOkOffer = (values: Offering) => {
        if (values?.id) {
            updateOffer(values, Number(selectedBusinessEmployee?.business?.id))?.then(res => {
                if (res.status !== 200) return;
                setData(prev => {
                    return prev.map(item => item.id === values.id ? values : item)
                })
            });
        } else {
            createOffer(values, Number(selectedBusinessEmployee?.business?.id), Number(selectedBusinessEmployee?.id)).then(res => {
                if (res.status !== 201) return

                setData(prev => [res.data, ...prev]);
            });
        }
    }

    const handleDeleteOffer = (offerId: number) => {
        deleteOffer(offerId, Number(selectedBusinessEmployee?.business?.id)).then(res => {
            if (res.status !== 204) return;

            setData(prev => prev.filter(item => item.id !== offerId))
        });

    }

    const itemRender: PaginationProps['itemRender'] = (parameter, type, originalElement) => {

        if (type === 'prev') {
            return <a onClick={fetchPrevPage}>{originalElement}</a>;
        }
        if (type === 'next') {
            return <a onClick={fetchNextPage}>{originalElement}</a>;
        }
        if (type === 'page') {
            return <a onClick={() => fetchPage(parameter - 1)}>{originalElement}</a>;
        }
        return originalElement;
    };

    return (
        <div className="w-full pl-5 mt-5">
            <EditOffering
                offer={editOffer}
                visible={editOfferingModal}
                onClose={handleCloseEditModal}
                onOk={handleOnOkOffer}
            />
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Szolgáltatásaim</h1>
                {
                    userHasPermission &&
                    <Button icon={<FiPlus />} onClick={() => setEditOfferingModal(true)}>
                        Új szolgáltatás
                    </Button>
                }
            </div>
            <Spin spinning={loading}>
                {
                    data.length === 0 ?
                        <div className="flex flex-col justify-center items-center mt-20">
                            <p className="text-gray-500 mb-4">Még nincs egy szolgáltatásod sem.</p>
                        </div>
                        :
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {
                                    data && data?.map((offer) => (
                                        <>
                                            <SettingsServicesCard
                                                key={offer.id}
                                                offer={offer}
                                                handleDeleteOffer={handleDeleteOffer}
                                                handleEditOffer={handleEditOffer}
                                                editable={userHasPermission}
                                            />
                                        </>
                                    ))
                                }
                                {
                                    data.length < 20 && userHasPermission &&
                                    <div onClick={() => setEditOfferingModal(true)} className="rounded-lg p-4 group flex hover:opacity-100 opacity-0 cursor-pointer bg-slate-50 justify-center items-center">
                                        <PiPlusBold size={30} />
                                        <span className="ml-2">Új szolgáltatás hozzáadása</span>
                                    </div>
                                }
                            </div>
                            <Pagination total={totalItems} className="flex mt-4 justify-end" current={currentPage + 1} itemRender={itemRender} pageSize={20} />
                        </>
                }
            </Spin>

        </div >
    )
}

export default SettingsMyServices
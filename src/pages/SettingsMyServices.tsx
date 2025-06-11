import { useState } from 'react'
import { usePagination } from '../hooks/usePagination'
import { Button, Card, message, Pagination, Popconfirm } from 'antd'
import EditOffering from '../components/Modals/EditOffering'
import { FiPlus } from 'react-icons/fi'
import { Offering } from '../helpers/types/Offering'
import { createOffer, deleteOffer, updateOffer } from '../helpers/queries/offeringService'
import { PaginationProps } from 'antd/lib'


const SettingsMyServices = () => {
    const [editOfferingModal, setEditOfferingModal] = useState(false);
    const { data, setData, totalItems, currentPage, fetchNextPage, fetchPrevPage, fetchPage } = usePagination<Offering>(`/api/offerings/business-owner`)
    const [editOffer, setEditOffer] = useState<Offering>({} as Offering);

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
            updateOffer(values)?.then(res => {
                if (res.status !== 200) {
                    message.error("Something went wrong!")
                    return
                }
                message.success("Successfully updated!");
                setData(prev => {
                    return prev.map(item => item.id === values.id ? values : item)
                })
            });
        } else {
            createOffer(values).then(res => {
                if (res.status !== 201) {
                    message.error("Something went wrong!")
                    return
                }
                message.success("Successfully created!");
                setData(prev => [res.data, ...prev]);
                handleCloseEditModal();
            });
        }
    }

    const handleDeleteOffer = (offerId: number) => {
        deleteOffer(offerId)?.then(res => {
            if (res.status !== 204) {
                message.error("Something went wrong!")
                return
            }
            message.success("Successfully deleted!");
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
                <Button icon={<FiPlus />} onClick={() => setEditOfferingModal(true)}>
                    Új szolgáltatás
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {
                    data && data?.map((offer) => (
                        <Card key={offer.id} title={
                            <div className="flex justify-between">
                                <p>{offer.title}</p>
                            </div>
                        }
                            className="shadow-sm"
                        >
                            <p>{offer.description}</p>
                            <p className="font-bold text-lg">{offer.price?.toFixed(0)} Ft</p>
                            <div className="grid grid-cols-3 mt-4 gap-2">
                                <Button type="primary" className="col-span-2" onClick={() => handleEditOffer(offer)}>Szerkesztés</Button>
                                <Popconfirm title="Biztosan törlöd?" okText={"Törlés"} okButtonProps={{ danger: true }} cancelText={"Mégsem"} onConfirm={() => handleDeleteOffer(offer.id)}>
                                    <Button danger>Törlés</Button>
                                </Popconfirm>
                            </div>
                        </Card>
                    ))
                }
            </div>
            <Pagination total={totalItems} className="flex mt-4 justify-end" current={currentPage + 1} itemRender={itemRender} pageSize={20} />
        </div >
    )
}

export default SettingsMyServices
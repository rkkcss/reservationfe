import { useState } from 'react'
import { usePagination } from '../hooks/usePagination'
import { Button, message, Pagination, Popconfirm, Spin } from 'antd'
import EditOffering from '../components/Modals/EditOffering'
import { FiPlus } from 'react-icons/fi'
import { Offering } from '../helpers/types/Offering'
import { createOffer, deleteOffer, updateOffer } from '../helpers/queries/offeringService'
import { PaginationProps } from 'antd/lib'
import { TbTrash } from 'react-icons/tb'
import { CiEdit } from 'react-icons/ci'
import { PiPlusBold } from 'react-icons/pi'


const SettingsMyServices = () => {
    const [editOfferingModal, setEditOfferingModal] = useState(false);
    const { data, setData, totalItems, currentPage, fetchNextPage, fetchPrevPage, fetchPage, loading } = usePagination<Offering>(`/api/offerings/business-owner`)
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
                                        <div key={offer.id} className="outline outline-1 outline-gray-300 rounded-lg p-4 group flex flex-col">
                                            <div className="flex mb-3 justify-between">
                                                <p className="font-bold text-base">{offer.title}</p>
                                                <div className="flex gap-2 group-hover:opacity-100 opacity-0">
                                                    <Button size="small" shape="circle" type="text" icon={<CiEdit size={18} />} onClick={() => handleEditOffer(offer)}></Button>
                                                    <Popconfirm
                                                        title="Biztosan törölni szeretnéd?"
                                                        onConfirm={() => handleDeleteOffer(offer.id!)}
                                                        okText="Igen"
                                                        cancelText="Nem"
                                                    >
                                                        <Button size="small" shape="circle" type="primary" danger icon={<TbTrash />}></Button>
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm">{offer.description}</p>
                                            </div>
                                            <div className="mt-auto">
                                                <p className="text-base font-bold mt-2">{offer.price} Ft</p>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    data.length < 20 &&
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
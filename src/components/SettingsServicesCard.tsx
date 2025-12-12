import { BASIC_ENTITY_STATUSES } from '../helpers/types/BasicEntityStatus';
import { CiEdit } from 'react-icons/ci';
import { Offering } from '../helpers/types/Offering';
import { Button, Popconfirm, Tag } from 'antd';
import { TbTrash } from 'react-icons/tb';

type SettingsServicesCardProps = {
    offer: Offering;
    handleEditOffer?: (offer: Offering) => void;
    handleDeleteOffer?: (offerId: number) => void;
    editable?: boolean;
}

const SettingsServicesCard = ({ offer, handleEditOffer, handleDeleteOffer, editable }: SettingsServicesCardProps) => {

    const handleEdit = () => {
        if (!handleEditOffer) return;
        handleEditOffer(offer);
    }

    const handleDelete = () => {
        if (!handleDeleteOffer) return;
        handleDeleteOffer(offer.id!);
    }

    return (
        <div key={offer.id} className="relative bg-white outline outline-1 outline-gray-200/50 rounded-lg p-4 group flex flex-col">
            {
                offer.status === BASIC_ENTITY_STATUSES.INACTIVE &&
                <div className="w-full h-full absolute bg-gray-100/50 rounded-lg top-0 left-0 flex items-center justify-center">
                </div>
            }
            <div className="flex mb-3 justify-between">
                <p className="font-bold text-base flex items-center gap-1">
                    {offer.title}
                </p>
                {
                    editable &&

                    <div className="flex gap-2 group-hover:opacity-100 opacity-0">
                        <Button size="small" shape="circle" type="text" icon={<CiEdit size={18} />} onClick={() => handleEdit()}></Button>
                        <Popconfirm
                            title="Biztosan törölni szeretnéd?"
                            onConfirm={() => handleDelete()}
                            okText="Igen"
                            cancelText="Nem"
                        >
                            <Button size="small" shape="circle" type="primary" danger icon={<TbTrash />}></Button>
                        </Popconfirm>
                    </div>
                }
                {
                    offer.status === BASIC_ENTITY_STATUSES.INACTIVE &&
                    <div className="block absolute top-2 right-1 gap-2 group-hover:hidden">
                        <Tag color="default">Inaktív</Tag>
                    </div>
                }
            </div>
            <div>
                <p className="text-sm">{offer.description}</p>
            </div>
            <div className="mt-auto">
                <p className="text-base font-bold mt-2">{offer.price} Ft</p>
            </div>
        </div>
    )
}

export default SettingsServicesCard
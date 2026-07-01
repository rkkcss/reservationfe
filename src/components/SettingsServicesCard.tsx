import { BASIC_ENTITY_STATUSES } from '../helpers/types/BasicEntityStatus';
import { Offering } from '../helpers/types/Offering';
import { Button, Divider, Popconfirm, Tag } from 'antd';
import { TbTrash } from 'react-icons/tb';
import { MdDeleteForever } from 'react-icons/md';

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
        <div key={offer.id} className="relative bg-white outline outline-1 outline-gray-300/50 rounded-lg p-4 group flex flex-col">
            <Tag
                color={offer.status === BASIC_ENTITY_STATUSES.ACTIVE ? "green" : "gray"}
                className="w-fit mb-5"
            >
                {offer.status === BASIC_ENTITY_STATUSES.ACTIVE ? "Aktív" : "Szünetel"}
            </Tag>
            <div>
                <p className="text-lg font-semibold mb-1">
                    {offer.title}
                </p>
                <p className="text-xs font-semibold text-gray-600">
                    {offer.description}
                </p>
            </div>
            <Divider />
            <div className="flex justify-between">
                <div>
                    <p className="text-gray-600">ÁR</p>
                    <p className="text-lg font-semibold">{offer.price} Ft</p>
                </div>
                <div>
                    <p className="text-gray-600">IDŐTARTAM</p>
                    <p className="text-base">
                        {offer.durationMinutes} perc
                    </p>
                </div>
            </div>
            {
                editable &&
                <div className="flex gap-3 mt-auto">
                    <Button className="flex-1"
                        onClick={handleEdit}
                    >Szerkesztés</Button>
                    <Popconfirm
                        title="Szolgáltatás törlése"
                        description="Biztosan szeretnéd törölni ezt a szolgáltatást? A művelet nem visszavonható!"
                        onConfirm={handleDelete}
                        okText="Igen"
                        okButtonProps={{ danger: true }}
                        icon={<MdDeleteForever className="text-red-500 mr-1" size={20} />}
                        cancelText="Mégsem"
                        cancelButtonProps={{ type: 'default' }}
                    >
                        <Button
                            danger
                            type="primary"
                            icon={<TbTrash />}
                        />
                    </Popconfirm>
                </div>
            }
        </div>
    )
}

export default SettingsServicesCard
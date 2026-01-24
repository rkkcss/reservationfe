import { startTransition, useEffect, useState } from "react"
import { createOffer, getOfferingsByEmployeeId, updateOffer } from "../../helpers/queries/offering-queries"
import { useBusinessEmployee } from "../../context/BusinessEmployeeContext";
import { Offering } from "../../helpers/types/Offering";
import SettingsServicesCard from "../../components/SettingsServicesCard";
import { useAppSelector } from "../../store/hooks";
import { BUSINESS_PERMISSIONS } from "../../helpers/types/BusinessPermission";
import { Button } from "antd";
import EditOffering from "../../components/Modals/EditOffering";


const EmployeeOfferings = () => {
    const { businessEmployee } = useBusinessEmployee();
    const [offerings, setOfferings] = useState<Offering[]>([]);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const [offeringModal, setOfferingModal] = useState(false);
    const [editOffer, setEditOffer] = useState<Offering>({} as Offering);


    useEffect(() => {
        if (!businessEmployee) return;
        getOfferingsByEmployeeId(businessEmployee?.id)
            .then(res => {
                setOfferings(res.data);
            })
    }, [])

    const handleOpenOfferModal = (offer: Offering) => {
        startTransition(() => {
            setOfferingModal(true);
            setEditOffer(offer || {} as Offering);
        });
    }

    const handleEditFormOk = (updatedOffer: Offering) => {
        if (!updatedOffer.id) {
            createOffer(updatedOffer, Number(selectedBusinessEmployee?.business?.id), Number(businessEmployee?.user?.id))
                .then((res) => {
                    if (res.status === 201) {
                        setOfferings(prev => [...prev, res.data]);
                    }
                });
            return
        }
        updateOffer(updatedOffer, Number(selectedBusinessEmployee?.business?.id))
            .then((res) => {
                if (res.status === 200) {
                    setOfferings(prev =>
                        prev.map(offer => offer.id === updatedOffer.id ? updatedOffer : offer)
                    );
                }
            });

    };

    return (
        <>
            {
                offeringModal &&
                <EditOffering
                    offer={editOffer}
                    visible={offeringModal}
                    onClose={() => setOfferingModal(false)}
                    onOk={handleEditFormOk}
                />
            }

            <div>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold mb-6">Szolgáltatások</h1>
                    <Button type="primary" onClick={() => handleOpenOfferModal({} as Offering)}>Új szolgáltatás</Button>
                </div>
                <div>
                    {
                        offerings.length === 0 &&
                        <p className="text-sm text-gray-500 text-center">Nincsenek hozzárendelve szolgáltatások ehhez a munkatárshoz.</p>
                    }
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {
                            offerings.map(offer => (
                                <SettingsServicesCard
                                    key={offer.id}
                                    offer={offer}
                                    editable={selectedBusinessEmployee?.permissions?.includes(BUSINESS_PERMISSIONS.EDIT_ALL_SERVICES)}
                                    handleEditOffer={() => handleOpenOfferModal(offer)}
                                />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default EmployeeOfferings
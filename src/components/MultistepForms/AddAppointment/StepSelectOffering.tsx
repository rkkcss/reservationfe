import { Form, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Offering } from "../../../helpers/types/Offering";
import { getOffersByBusinessId } from "../../../helpers/queries/offeringService";

type StepSelectOfferingProps = {
    offer?: Offering;
    setOffer?: (offer: Offering) => void;
}

const StepSelectOffering = ({ offer, setOffer }: StepSelectOfferingProps) => {
    const [offers, setOffers] = useState<Offering[]>([]);

    const getAllOffers = useCallback(() => {
        getOffersByBusinessId(1).then((res) => {
            setOffers(res);
        });
    }, []);

    useEffect(() => {
        getAllOffers();
    }, [getAllOffers]);

    const handleOnChange = (value: number | undefined) => {
        if (value && setOffer) {
            const selectedOffer = offers.find((o) => o.id === value);
            if (selectedOffer) {
                setOffer(selectedOffer);
            }
        }
    }

    return (
        <>
            <Form.Item
                name="offeringId"
                label="Szolgáltatás"
                rules={[{ required: true, message: 'Kérjük válasszon szolgáltatást!' }]}
                initialValue={offer ? offer.id : undefined}
            >
                <Select placeholder="Szolgáltatás" allowClear onChange={(v) => handleOnChange(v)}>
                    {offers.map((offer) => (
                        <Select.Option key={offer.id} value={offer.id} label={offer.name}>
                            {offer.title}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    );
}

export default StepSelectOffering;

import { Form, Input, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Offering } from "../../../helpers/types/Offering";
import { getOffersByBusinessId } from "../../../helpers/queries/offeringService";

type StepSelectOfferingProps = {
    offer?: Offering;
}

const StepSelectOffering = ({ offer }: StepSelectOfferingProps) => {
    const [offers, setOffers] = useState<Offering[]>([]);

    const getAllOffers = useCallback(() => {
        getOffersByBusinessId(1).then((res) => {
            setOffers(res);
        });
    }, []);

    useEffect(() => {
        getAllOffers();
    }, [getAllOffers]);


    return (
        <>
            <Form.Item
                name="offeringId"
                label="Szolgáltatás"
                rules={[{ required: true, message: 'Kérjük válasszon szolgáltatást!' }]}
                initialValue={offer ? offer.id : undefined}
            >
                <Select placeholder="Szolgáltatás" allowClear>
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

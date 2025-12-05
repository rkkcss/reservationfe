import { Button, notification, Tooltip } from "antd"
import { FiUserPlus } from "react-icons/fi"
import AddOrEditGuestModal from "./AddOrEditGuestModal";
import { Guest } from "../../helpers/types/Guest";
import { useState } from "react";
import { createQuest } from "../../helpers/queries/guest-queries";

type AddOrEditGuestModalWButtonProps = {
    afterSubmit: (guest: Guest) => void;
}

const AddOrEditGuestModalWButton = ({ afterSubmit }: AddOrEditGuestModalWButtonProps) => {
    const [addGuestModal, setAddGuestModal] = useState(false);

    const handleGuestSubmit = (guest: Guest) => {
        if (guest.id) notification.success({ message: "Itt nem kéne hogy legyen ID-ja a vendégnek!" });

        createQuest(guest)
            .then((res) => {
                afterSubmit(res.data);
            });
    }

    return (
        <>
            <AddOrEditGuestModal onOk={handleGuestSubmit} onClose={() => setAddGuestModal(false)} open={addGuestModal} guest={{} as Guest} />
            <Tooltip title="Új vendég hozzáadása">
                <Button className="mt-1.5" onClick={() => setAddGuestModal(true)} shape="default" size="large">
                    <FiUserPlus size={20} />
                </Button>
            </Tooltip>

        </>
    )
}

export default AddOrEditGuestModalWButton
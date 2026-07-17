import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";

type EventTypePickerModalProps = {
    open: boolean;
    onClose: () => void;
    onPickAppointment: () => void;
    onPickTimeOff: () => void;
};

const EventTypePickerModal = ({
    open,
    onClose,
    onPickAppointment,
    onPickTimeOff,
}: EventTypePickerModalProps) => {
    const { t } = useTranslation("add-timeoff-modal");

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={t("whatToCreate")}
            footer={null}
            destroyOnHidden
        >
            <div className="flex gap-2 mt-4">
                <Button type="primary" onClick={onPickAppointment} block>
                    {t("appointment")}
                </Button>
                <Button onClick={onPickTimeOff} block>
                    {t("timeOff")}
                </Button>
            </div>
        </Modal>
    );
};

export default EventTypePickerModal;

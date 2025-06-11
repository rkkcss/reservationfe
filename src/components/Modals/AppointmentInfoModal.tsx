import { Modal } from 'antd'

type AppointmentInfoModalProps = {
    open: boolean;
    onClose: () => void;
}

const AppointmentInfoModal = ({ open, onClose }: AppointmentInfoModalProps) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={false}
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Időpont részletei</h2>
                <p>Ez a funkció még fejlesztés alatt áll.</p>
                <p>Hamarosan elérhető lesz!</p>
            </div>
        </Modal>
    )
}

export default AppointmentInfoModal
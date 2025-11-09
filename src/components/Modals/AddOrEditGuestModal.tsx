import { Button, Form, Input, Modal, Select, Tooltip } from 'antd'
import { Guest } from '../../helpers/types/Guest';
import { IoCheckmarkCircle, IoCloseCircleSharp } from 'react-icons/io5';
import { GoInfo } from "react-icons/go";
import { t } from 'i18next';
import { isValidPhoneNumber } from 'libphonenumber-js';

type AddOrEditGuestModalProps = {
    open: boolean;
    onClose: () => void;
    guest: Guest;
    onOk: (guest: Guest) => void;
}

const AddOrEditGuestModal = ({ open, onClose, guest, onOk }: AddOrEditGuestModalProps) => {
    const onFinish = (values: Guest) => {
        console.log(values)
        onOk(values);
        onClose();
    };

    return (
        <Modal onCancel={onClose} open={open} title={guest?.id ? "Vendég szerkesztése" : "Új vendég hozzáadása"} footer={null} destroyOnClose>
            <Form layout="vertical" onFinish={onFinish}
                className="mt-5"
                initialValues={guest}
                key={guest?.id || "new"}
            >
                {
                    guest?.id && <Form.Item name="id" initialValue={guest.id} hidden />
                }
                <Form.Item label="Név" name="name" rules={[{ required: true, message: 'Kérjük, adja meg a nevet!' }]}>
                    <Input placeholder="Vendég neve" />
                </Form.Item>
                <Form.Item label="E-mail" name="email" rules={[{
                    required: true,
                    message: 'Kérjük, adja meg a e-mail-t!'
                },

                () => ({
                    validator(_, value) {
                        if (!value) {
                            return Promise.resolve();
                        }
                        if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)) {
                            return Promise.reject(t("validEmail"));
                        }
                        return Promise.resolve();
                    }
                })
                ]}>
                    <Input placeholder="Vendég e-mail" />
                </Form.Item>
                <Form.Item label="Telefonszám" name="phoneNumber" rules={[{
                    required: true,
                    message: 'Kérjük, adja meg a telefonszámot!'
                }
                    , {
                    validator(_, value) {
                        if (!value || isValidPhoneNumber(value)) {
                            return Promise.resolve();
                        }
                        return Promise.reject("Érvénytelen telefonszám formátum!");
                    },
                },
                ]}>
                    <Input placeholder="Vendég telefonszám" />
                </Form.Item>
                <Form.Item label={(
                    <div className="flex items-center gap-2">
                        <span>Foglalás engedélyezése</span>
                        <Tooltip title="Engedélyezed-e, hogy ez a vendég online foglalhasson időpontot.">
                            <GoInfo size={17} className="cursor-pointer" strokeWidth={0.5} />
                        </Tooltip>
                    </div>)}
                    name="canBook" rules={[{ required: true, message: 'Kérjük, adja meg a telefonszámot!' }]}>
                    <Select>
                        <Select.Option value={true}>
                            <span className="flex items-center gap-1 text-green-500">
                                <IoCheckmarkCircle size={17} />Engedélyezett
                            </span>
                        </Select.Option>
                        <Select.Option value={false}>
                            <span className="flex items-center gap-1 text-red-500">
                                <IoCloseCircleSharp size={17} strokeWidth={1} width={17} height={17} />Tiltott
                            </span>
                        </Select.Option>
                    </Select>
                </Form.Item>
                <div className="flex justify-between mt-10">
                    <Button type="primary" htmlType="submit">Mentés</Button>
                    <Button type="default" onClick={onClose}>Mégsem</Button>
                </div>
            </Form>
        </Modal>
    )
}

export default AddOrEditGuestModal
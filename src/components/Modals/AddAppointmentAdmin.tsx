import { Button, DatePicker, Form, Modal, Popconfirm, Select, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Appointment } from '../../helpers/types/Appointment'
import { getAllGuestsBySearch } from '../../helpers/queries/guestService'
import { Guest } from '../../helpers/types/Guest'
import { useCallback, useEffect, useState } from 'react'
import { getOfferingByLoggedInBusiness } from '../../helpers/queries/offeringService'
import { Offering } from '../../helpers/types/Offering'
import { MdDeleteForever } from 'react-icons/md'

type AddAppointmentAdminProps = {
    open: boolean,
    onClose: () => void,
    appointment?: Appointment,
    onOk?: (appointment: Appointment) => void,
    deleteAppointment?: (appointmentId: number) => void,
}

const AddAppointmentAdmin = ({ open, onClose, appointment, onOk, deleteAppointment }: AddAppointmentAdminProps) => {
    const [form] = Form.useForm();
    const [searchedGuests, setSearchedGuests] = useState<Guest[]>([]);
    const [offers, setOffers] = useState<Offering[]>([]);

    const searchInGuests = (value: string) => {
        getAllGuestsBySearch(value).then((res) => {
            setSearchedGuests(res.data);
        });
    }

    const getAllOffers = useCallback(() => {
        getOfferingByLoggedInBusiness().then((res) => {
            setOffers(res);
        });
    }, []);

    useEffect(() => {
        if (open) {
            getAllOffers();
        }
    }, [open, getAllOffers])

    useEffect(() => {
        const mergeEntity = <T extends { id: number }>(
            entity: T | undefined,
            setList: React.Dispatch<React.SetStateAction<T[]>>,
            formKey: string
        ) => {
            if (!entity) return;

            // hozzáadjuk, ha még nincs benne
            setList((prev) => {
                const exists = prev.some(item => item.id === entity.id);
                return exists ? prev : [entity, ...prev];
            });

            form.setFieldsValue({
                [formKey]: entity.id,
            });
        };

        mergeEntity(appointment?.guest, setSearchedGuests, 'guestId');
        mergeEntity(appointment?.offering, setOffers, 'offeringId');

    }, [appointment, form, searchedGuests, offers]);

    const handleOnFinish = (values: Appointment) => {
        if (onOk) onOk(values);
    }

    const handleDeleteAppointment = () => {
        if (appointment?.id && deleteAppointment) {
            deleteAppointment(appointment.id);
        }
        onClose();
    }

    return (
        <Modal open={open} onCancel={onClose} title={`${appointment?.id ? "Időpont szerkesztése" : "Időpont hozzáadása"}`} footer={null}>
            <Form
                layout="vertical"
                initialValues={appointment}
                onFinish={handleOnFinish}
                form={form}
            >
                <Form.Item name="id" hidden />
                <Form.Item label="Megjegyzés" name="note">
                    <TextArea placeholder="Megjegyzés..." />
                </Form.Item>

                <Form.Item label="Vendég" name="guestId">
                    <Select
                        showSearch
                        placeholder="Vendég neve"
                        filterOption={false}
                        onSearch={searchInGuests}
                        options={searchedGuests.map(g => ({
                            label: g.name,
                            value: g.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="offeringId"
                    label="Szolgáltatás"
                >
                    <Select
                        filterOption={false}
                        placeholder="Szolgáltatás"
                        options={
                            offers.map((offer) => ({
                                label: offer.title,
                                value: offer.id,
                            }))
                        }>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Státusz"
                >
                    <Select placeholder="Időpont státusza">
                        <Select.Option value="PENDING" label="PENDING">
                            <span className="text-yellow-500">Elfogadásra vár</span>
                        </Select.Option>
                        <Select.Option value="CONFIRMED" label="CONFIRMED">
                            <span className="text-green-500">Elfogadva</span>
                        </Select.Option>
                        <Select.Option value="CANCELLED" label="CANCELLED">
                            <span className="text-red-500">Elutasítva</span>
                        </Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Időpont kezdete"
                    rules={[{ required: true, message: 'Kérjük válasszon időpontot!' }]}
                    name="startDate"
                >
                    <DatePicker showTime className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Időpont vége"
                    name="endDate"
                    rules={[{ required: true, message: 'Kérjük válasszon időpontot!' }]}
                >
                    <DatePicker showTime className="w-full" />
                </Form.Item>
                <div className="flex justify-between items-center">
                    {
                        appointment?.id && deleteAppointment &&
                        <Tooltip
                            title="Időpont törlése"
                            placement="bottom"
                        >
                            <Popconfirm
                                title="Biztosan törölni szeretné az időpontot?"
                                onConfirm={handleDeleteAppointment}
                                okText="Igen"
                                cancelText="Nem"
                                okButtonProps={{ danger: true }}
                                cancelButtonProps={{ type: 'default' }}
                            >
                                <Button
                                    type="text"
                                    size="large"
                                    icon={<MdDeleteForever size={24} color="red" />}
                                    shape="circle"
                                />
                            </Popconfirm>
                        </Tooltip>
                    }

                    <div>
                        <Button type="primary" htmlType="submit">
                            {appointment?.id ? 'Időpont szerkesztése' : 'Új időpont hozzáadása'}
                        </Button>
                        <Button type="default" className=" ml-2" onClick={onClose}>
                            Mégse
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal >
    )
}

export default AddAppointmentAdmin
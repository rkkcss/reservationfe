import { Button, DatePicker, Form, Modal, Popconfirm, Select, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Appointment } from '../../helpers/types/Appointment'
import { getAllGuestsBySearch } from '../../helpers/queries/guestService'
import { Guest } from '../../helpers/types/Guest'
import { useCallback, useEffect, useState } from 'react'
import { getOfferingByLoggedInBusiness } from '../../helpers/queries/offeringService'
import { Offering } from '../../helpers/types/Offering'
import { MdDeleteForever } from 'react-icons/md'
import AddOrEditGuestModalWButton from './AddOrEditGuestModalWButton'
import { useTranslation } from 'react-i18next'
import { BiUser } from 'react-icons/bi'

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
    const { t } = useTranslation('add-appointment-admin-modal');

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
            form.setFieldsValue(appointment)
        }
    }, [open, getAllOffers])


    const mergeEntity = useCallback(<T extends { id: number | null }>(
        entity: T | undefined,
        setList: React.Dispatch<React.SetStateAction<T[]>>,
        formKey: string
    ) => {
        if (!entity) return;

        setList((prev) => {
            const exists = prev.some(item => item.id === entity.id);
            return exists ? prev : [entity, ...prev];
        });

        form.setFieldsValue({
            [formKey]: entity.id,
        });
    }, [form]);

    useEffect(() => {
        mergeEntity(appointment?.guest, setSearchedGuests, 'guestId');
        mergeEntity(appointment?.offering, setOffers, 'offeringId');
    }, [appointment, form, searchedGuests, offers, mergeEntity]);

    const handleOnFinish = (values: Appointment) => {
        if (onOk) onOk(values);
    }

    const handleDeleteAppointment = () => {
        if (appointment?.id && deleteAppointment) {
            deleteAppointment(appointment.id);
        }
        onClose();
    }

    const afterGuestSubmit = (newGuest: Guest) => {
        mergeEntity(newGuest, setSearchedGuests, 'guestId');
    }

    return (
        <>
            <Modal
                open={open}
                onCancel={onClose}
                title={`${appointment?.id ? t("editAppointment") : t("addAppointment")}`}
                footer={null}
                destroyOnClose
            >
                <Form
                    layout="vertical"
                    initialValues={appointment}
                    onFinish={handleOnFinish}
                    form={form}
                    key={appointment?.id || "new"}
                >
                    <Form.Item name="id" hidden />
                    <Form.Item label={t("note")} name="note">
                        <TextArea placeholder={t("note") + "..."} />
                    </Form.Item>

                    <div className="flex items-center gap-2">
                        <Form.Item label={t("guest")} name="guestId" className="flex-1 w-full">
                            <Select
                                size="large"
                                className=""
                                showSearch
                                placeholder={t("guestName")}
                                filterOption={false}
                                onSearch={searchInGuests}
                                options={searchedGuests.map(g => ({
                                    label: g.name,
                                    value: g.id,
                                }))}
                                labelRender={(e) =>
                                    <div className="flex items-center gap-1">
                                        <div className="flex flex-col">
                                            <p className="text-sm">{e.label}</p>
                                            <p className="text-xs">{searchedGuests.find(g => g.id === e.value)?.email || appointment?.guest?.email}</p>
                                        </div>
                                    </div>
                                }
                                optionRender={(e) =>
                                    <div className="flex items-center gap-2">
                                        <BiUser size={20} />
                                        <div>
                                            <p className="text-sm">{searchedGuests.find(g => g.id === e.value)?.name}</p>
                                            <p className="text-xs">{searchedGuests.find(g => g.id === e.value)?.email}</p>
                                        </div>
                                    </div>
                                }
                                allowClear
                            />
                        </Form.Item>
                        <AddOrEditGuestModalWButton afterSubmit={afterGuestSubmit} />
                    </div>

                    <Form.Item
                        name="offeringId"
                        label={t("service")}
                    >
                        <Select
                            filterOption={false}
                            placeholder={t("service") + "..."}
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
                        label={t("status")}
                    >
                        <Select placeholder="Időpont státusza">
                            <Select.Option value="PENDING" label="PENDING">
                                <span className="text-yellow-500">{t("pendingApproval")}</span>
                            </Select.Option>
                            <Select.Option value="CONFIRMED" label="CONFIRMED">
                                <span className="text-green-500">{t("confirmed")}</span>
                            </Select.Option>
                            <Select.Option value="CANCELLED" label="CANCELLED">
                                <span className="text-red-500">{t("rejected")}</span>
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={t("appointmentStartAt")}
                        rules={[{ required: true, message: t("pleaseSelectDate") }]}
                        name="startDate"
                    >
                        <DatePicker format="YYYY.MM.DD HH:mm" showTime={{ format: "HH:mm", minuteStep: 5 }} className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label={t("appointmentEndAt")}
                        name="endDate"
                        rules={[
                            { required: true, message: t("pleaseSelectDate") },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const start = getFieldValue("startDate");
                                    if (!value || !start || value.isAfter(start)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(t("cantBeforeStart"));
                                },
                            }),
                        ]}
                    >
                        <DatePicker
                            format="YYYY.MM.DD HH:mm"
                            showTime={{ format: "HH:mm", minuteStep: 5 }}
                            className="w-full"
                            disabledDate={(current) => {
                                const start = form.getFieldValue("startDate");
                                return start && current && current.isBefore(start.startOf("day"));
                            }}
                            disabledTime={(current) => {
                                const start = form.getFieldValue("startDate");
                                if (!start || !current) return {};
                                if (current.isSame(start, "day")) {
                                    return {
                                        disabledHours: () => [...Array(24).keys()].filter(h => h < start.hour()),
                                        disabledMinutes: (h) =>
                                            h === start.hour()
                                                ? [...Array(60).keys()].filter(m => m < start.minute())
                                                : [],
                                    };
                                }
                                return {};
                            }}
                        />
                    </Form.Item>
                    <div className="flex justify-between items-center">
                        {
                            appointment?.id && deleteAppointment &&
                            <Tooltip
                                title={t("deleteAppointment")}
                                placement="bottom"
                            >
                                <Popconfirm
                                    title={t("confirmDeleteAppointment")}
                                    onConfirm={handleDeleteAppointment}
                                    okText={t("yes")}
                                    cancelText={t("no")}
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
                                {appointment?.id ? t("editAppointment") : t("addAppointment")}
                            </Button>
                            <Button type="default" className=" ml-2" onClick={onClose}>
                                {t("cancel")}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default AddAppointmentAdmin
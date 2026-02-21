import { Button, Form, Modal, Popconfirm, Select, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Appointment, CreateAdminAppointmentRequest } from '../../../helpers/types/Appointment'
import { Guest } from '../../../helpers/types/Guest'
import { MdDeleteForever } from 'react-icons/md'
import AddOrEditGuestModalWButton from '../AddOrEditGuestModalWButton'
import { useTranslation } from 'react-i18next'
import { BiUser } from 'react-icons/bi'
import useSelectedEmployee from '../../../hooks/useSelectedEmployee'
import { BUSINESS_PERMISSIONS } from '../../../helpers/types/BusinessPermission'
import { EmployeeSelector } from './EmployeeSelector'
import { StatusSelector } from './StatusSelector'
import { DateRangeSelector } from './DateRangeSelector'
import { useAppointmentForm } from './useAddAppointmentForm'

type AddAppointmentAdminProps = {
    open: boolean,
    onClose: () => void,
    appointment?: Appointment | CreateAdminAppointmentRequest,
    onOk?: (appointment: CreateAdminAppointmentRequest) => void,
    deleteAppointment?: (appointmentId: number) => void,
}

const AddAppointmentAdmin = ({ open, onClose, appointment, onOk, deleteAppointment }: AddAppointmentAdminProps) => {
    const { t } = useTranslation('add-appointment-admin-modal');
    const { hasPermission } = useSelectedEmployee();

    const {
        form,
        searchedGuests,
        offers,
        employeeOptions,
        searchInGuests,
        getEmployeeOptions,
        handleOnFinish,
        mergeEntity,
        setSearchedGuests
    } = useAppointmentForm(appointment, open, onClose, onOk);

    const handleDelete = () => {
        if (appointment?.id && deleteAppointment) deleteAppointment(appointment.id);
        onClose();
    };

    const afterGuestSubmit = (newGuest: Guest) => {
        mergeEntity(newGuest, setSearchedGuests, 'guestId');
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={appointment?.id ? t("editAppointment") : t("addAppointment")}
            footer={null}
            destroyOnClose
        >
            <Form
                layout="vertical"
                initialValues={appointment}
                onFinish={handleOnFinish}
                form={form}
                key={`${appointment?.id ?? 'new'}-${open ? 'open' : 'closed'}`}
            >
                <Form.Item name="id" hidden />
                <Form.Item label={t("note")} name="note">
                    <TextArea placeholder={t("note") + "..."} />
                </Form.Item>

                {hasPermission(BUSINESS_PERMISSIONS.EDIT_ALL_BOOKINGS) && (
                    <EmployeeSelector
                        options={employeeOptions}
                        loadOptions={getEmployeeOptions}
                    />
                )}

                <div className="flex items-center gap-2">
                    <Form.Item label={t("guest")} name="guestId" className="flex-1 w-full">
                        <Select
                            size="large"
                            showSearch
                            onSearch={searchInGuests}
                            options={searchedGuests.map(g => ({ label: g.name, value: g.id }))}
                            labelRender={(e) => (
                                <div className="flex items-center gap-1">
                                    <div className="flex flex-col">
                                        <p className="text-sm">{e.label}</p>
                                        <p className="text-xs">{searchedGuests.find(g => g.id === e.value)?.email || appointment?.guest?.email}</p>
                                    </div>
                                </div>
                            )}
                            optionRender={(e) => (
                                <div className="flex items-center gap-2">
                                    <BiUser size={20} />
                                    <div>
                                        <p className="text-sm">{searchedGuests.find(g => g.id === e.value)?.name}</p>
                                        <p className="text-xs">{searchedGuests.find(g => g.id === e.value)?.email}</p>
                                    </div>
                                </div>
                            )}
                            allowClear
                        />
                    </Form.Item>
                    <AddOrEditGuestModalWButton afterSubmit={afterGuestSubmit} />
                </div>

                <Form.Item name="offeringId" label={t("service")}>
                    <Select
                        placeholder={t("service") + "..."}
                        options={offers.map((offer) => ({ label: offer.title, value: offer.id }))}
                    />
                </Form.Item>

                <StatusSelector t={t} />
                <DateRangeSelector form={form} t={t} />

                <div className="flex justify-between items-center mt-4">
                    {appointment?.id && deleteAppointment && (
                        <Tooltip title={t("deleteAppointment")} placement="bottom">
                            <Popconfirm title={t("confirmDeleteAppointment")} onConfirm={handleDelete}>
                                <Button type="text" icon={<MdDeleteForever size={24} color="red" />} shape="circle" />
                            </Popconfirm>
                        </Tooltip>
                    )}
                    <div className="flex gap-2">
                        <Button type="primary" htmlType="submit">
                            {appointment?.id ? t("editAppointment") : t("addAppointment")}
                        </Button>
                        <Button onClick={onClose}>{t("cancel")}</Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default AddAppointmentAdmin
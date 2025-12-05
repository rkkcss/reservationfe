import { Button, Card, Checkbox, Form, Input, Modal, Select } from "antd"
import { permissionGroups } from "../../helpers/types/BusinessPermission"
import { businessEmployeeRoleLabels } from "../../helpers/types/BusinessEmployeeRole";
import { BusinessEmployeeInvite } from "../../helpers/types/BusinessEmployeeInvite";
import API from "../../utils/API";
import { useSelector } from "react-redux";
import { UserStore } from "../../store/store";
import { notificationManager } from "../../utils/notificationConfig";
import { AxiosError } from "axios";

type NewEmployeeModalProps = {
    onCancel: () => void;
}

const NewEmployeeModal = ({ onCancel }: NewEmployeeModalProps) => {
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const onFinish = (values: BusinessEmployeeInvite) => {
        console.log('Form values:', values);
        API.post(`/api/employee-invite/${selectedBusinessEmployee?.business.id}`, values)
            .then(response => {
                console.log('Invite created successfully:', response.data);
            })
            .catch((error: AxiosError) => {
                console.log(error)
                notificationManager.error("employee-invite-create-failed", { message: error.message });
            });
    }

    return (
        <Modal title="Új alkalmazott hozzáadása" open={true} onCancel={onCancel} footer={null}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Email" name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Kérlek adja meg az e-mail cimet!',
                        }
                    ]}>
                    <Input type="email" />
                </Form.Item>
                <Form.Item label="Szerepkör" name="role"
                    rules={[
                        {
                            required: true,
                            message: 'Kérlek válassz szerepkört!',
                        }
                    ]}>
                    <Select placeholder="Ki lesz ő a cégnél?" style={{ width: '100%' }} >
                        {
                            Object.entries(businessEmployeeRoleLabels).map(([key, label]) => (
                                <Select.Option key={key} value={key}>
                                    {label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="permissions" label="Jogosultságok">
                    <Checkbox.Group className="w-full">
                        <div className="space-y-6 w-full">
                            {permissionGroups.map(group => (
                                <Card
                                    key={group.title}
                                    className="border border-gray-200 transition-colors w-full"
                                >
                                    <h4 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-800">
                                        {group.title}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {group.permissions.map(p => (
                                            <Checkbox
                                                key={p.key}
                                                value={p.key}
                                                className="!items-start hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-700">
                                                        {p.label}
                                                    </span>
                                                </div>
                                            </Checkbox>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Checkbox.Group>
                </Form.Item>
                <Button type="primary" htmlType="submit">Létrehozás</Button>
            </Form>
        </Modal>
    )
}

export default NewEmployeeModal
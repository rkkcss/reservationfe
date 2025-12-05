import { Button, Divider, Form, Switch } from 'antd';
import { useEffect, useState } from 'react'
import { BUSINESS_PERMISSIONS, BusinessPermission, permissionGroups } from '../../helpers/types/BusinessPermission';
import { useBusinessEmployee } from '../../context/BusinessEmployeeContext';
import { UserStore } from '../../store/store';
import { useSelector } from 'react-redux';
import { API } from '../../utils/API';
import { BUSINESS_EMPLOYEE_ROLE } from '../../helpers/types/BusinessEmployeeRole';

const EmployeePermissions = () => {
    const [isViewMode, setIsViewMode] = useState(true);
    const [form] = Form.useForm();
    const { businessEmployee } = useBusinessEmployee();
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);

    useEffect(() => {
        if (businessEmployee?.permissions) {
            const initialValues = businessEmployee.permissions.reduce((acc, permission) => {
                acc[permission] = true;
                return acc;
            }, {} as Record<string, boolean>);

            form.setFieldsValue(initialValues);
        }
        setIsViewMode(() => {
            //if it's the same user (user can't change their own permissions)
            return (selectedBusinessEmployee?.user.id === businessEmployee?.user.id)
                ||
                (businessEmployee?.role === BUSINESS_EMPLOYEE_ROLE.OWNER);
        })
    }, [form, businessEmployee]);

    const onFinish = (values: Record<string, boolean>) => {
        console.log(values)
        const permissions = Object.entries(values)
            .filter(([, value]) => value === true)
            .map(([key]) => key as BusinessPermission);
        API.patch(`api/business-employee/${businessEmployee?.id}/permissions`, permissions)
            .then(res => {
                console.log(res)
            })
    };

    const handleSelectAll = () => {
        const allPermissions = Object.values(BUSINESS_PERMISSIONS).reduce((acc, permission) => {
            acc[permission] = true;
            return acc;
        }, {} as Record<string, boolean>);
        form.setFieldsValue(allPermissions);
    };

    const handleDeselectAll = () => {
        const noPermissions = Object.values(BUSINESS_PERMISSIONS).reduce((acc, permission) => {
            acc[permission] = false;
            return acc;
        }, {} as Record<string, boolean>);
        form.setFieldsValue(noPermissions);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                    Jogosultságok kezelése
                </h2>
                <p className="text-gray-600">
                    Válaszd ki, mely funkciókat érheti el az alkalmazott
                </p>
            </div>

            {
                !isViewMode &&
                <div className="mb-4 flex gap-2">
                    <Button onClick={handleSelectAll} size="small">
                        Összes kijelölése
                    </Button>
                    <Button onClick={handleDeselectAll} size="small">
                        Összes törlése
                    </Button>
                </div>
            }

            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="bg-white rounded-lg border border-gray-200 p-6"
            >
                {permissionGroups.map((group, index) => (
                    <div key={group.title}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            {group.title}
                        </h3>

                        {group.permissions.map((permission) => (
                            <div key={permission.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors mb-3">
                                <span className="text-gray-700">{permission.label}</span>
                                <Form.Item
                                    name={permission.key}
                                    valuePropName="checked"
                                    className="mb-0"
                                >
                                    <Switch disabled={isViewMode} />
                                </Form.Item>
                            </div>
                        ))}

                        {index < permissionGroups.length - 1 && (
                            <Divider className="my-6" />
                        )}
                    </div>
                ))}
                <div className="mt-6 flex gap-3 justify-end">
                    <Button type="primary" htmlType="submit">
                        Mentés
                    </Button>
                </div>



            </Form>
        </div>
    );
}

export default EmployeePermissions
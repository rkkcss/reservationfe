import { Button, Form, Input, InputNumber, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
import { getBusinessByLoggedInUser, patchBusiness } from '../helpers/queries/businessService'
import { Business } from '../helpers/types/Business'
import { useForm } from 'antd/es/form/Form'

type Props = {}

const SettingsBusiness = (props: Props) => {
    const [form] = useForm()
    const [business, setBusiness] = useState<Business>({})

    useEffect(() => {
        getBusinessByLoggedInUser()
            .then(res => {
                setBusiness(res.data);
                form.setFieldsValue(res.data);
            });
    }, [form]);

    const handleSubmit = (values: Business) => {
        patchBusiness(values)
            .then(() => {
                message.success("Sikeres frissités")
            }).catch(() => {
                message.error("Hiba történt. Próbáld meg késöbb!")
            });
    }

    return (
        <div className="w-full pl-5 mt-5">
            <h1 className="text-2xl font-bold mb-4">Üzlet</h1>
            <Form layout="vertical" form={form} onFinish={handleSubmit} onFinishFailed={(v) => console.log(v)}>
                <Form.Item hidden name="id">
                    <Input hidden />
                </Form.Item>
                <Form.Item label="Üzlet neve" name="name">
                    <Input placeholder="Név..." />
                </Form.Item>
                <Form.Item label="Üzlet címe" name="address">
                    <Input placeholder="Cím..." />
                </Form.Item>
                <Form.Item label="Leírás" name="description" rules={[{ max: 500 }]}>
                    <TextArea placeholder="Leírás..." />
                </Form.Item>
                <Form.Item label="Telefonszám" name="phoneNumber" rules={[{ max: 500 }]}>
                    <Input placeholder="Telefonszám..." />
                </Form.Item>
                <Form.Item label="Szünet két időpont között" name="breakBetweenAppointmentsMin">
                    <InputNumber placeholder="Szünet..." className="w-full" />
                </Form.Item>
                <Button htmlType="submit" type="primary">Mentés</Button>
            </Form>
        </div>
    )
}

export default SettingsBusiness
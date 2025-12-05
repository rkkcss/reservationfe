import { Alert, Button, Form, Input, InputNumber, Select, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { patchBusiness } from '../helpers/queries/business-queries'
import { Business } from '../helpers/types/Business'
import { useForm, useWatch } from 'antd/es/form/Form'
import { MdInfoOutline } from 'react-icons/md'
import { useEffect } from 'react'

type SettingsBusinessDataProps = {
    business: Business
}

const SettingsBusinessData = ({ business }: SettingsBusinessDataProps) => {
    const [form] = useForm()
    const appointmentApprovalRequired = useWatch('appointmentApprovalRequired', form)

    useEffect(() => {
        form.setFieldsValue(business)
    }, [business, form])

    const handleSubmit = (values: Business) => {
        patchBusiness(values);
    }

    return (
        <div className="">
            <Form layout="vertical" form={form} onFinish={handleSubmit} onFinishFailed={(v) => console.log(v)}>
                <Form.Item hidden name="id">
                    <Input hidden />
                </Form.Item>
                <Form.Item label="Üzlet neve" name="name">
                    <Input placeholder="Név..." />
                </Form.Item>
                <Form.Item label="Üzlet címe" name="address">
                    <Input placeholder="Cím..." count={{
                        show: true,
                        max: 255
                    }} />
                </Form.Item>
                <Form.Item label="Leírás" name="description" rules={[{ max: 500 }]}>
                    <TextArea placeholder="Leírás..." count={{
                        show: true,
                        max: 500
                    }} />
                </Form.Item>
                <Form.Item label="Telefonszám" name="phoneNumber" rules={[{ max: 15 }]}>
                    <Input placeholder="Telefonszám..." />
                </Form.Item>
                <Form.Item
                    label={
                        <div className="flex gap-1 items-center">
                            <span>Időpontok automatikus elfogadása</span>
                            <Tooltip title="Be tudod állitani hogy a mindig neked kelljen megerősítened a foglalásokat, vagy a rendszer automatikusan elfogadja el öket!">
                                <MdInfoOutline size={20} />
                            </Tooltip>
                        </div>
                    }
                    name="appointmentApprovalRequired"
                >
                    <Select
                        options={[
                            { label: "Igen", value: false },
                            { label: "Nem", value: true }
                        ]}
                    />
                </Form.Item>
                {appointmentApprovalRequired === true &&
                    <Alert showIcon type="info" message="A rendszer most minden a jövőben lefoglalt időpontot el fog fogadni és nem neked kell." className="mb-4" />}
                {appointmentApprovalRequired === false &&
                    <Alert showIcon type="info" message="A bejövő idöpontokat neked kell majd elfogadnod!" className="mb-4" />}

                <Form.Item name="maxWeeksInAdvance" label="Add meg hány hétre előre tudjanak foglalni a vendégek">
                    <InputNumber
                        min={0}
                        max={52}
                        placeholder="Hány hét..."
                        className="w-full"
                        maxLength={2}
                    />
                </Form.Item>

                <Button htmlType="submit" type="primary">Mentés</Button>
            </Form>
        </div>
    )
}

export default SettingsBusinessData
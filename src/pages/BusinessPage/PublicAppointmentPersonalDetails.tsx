import { Form, Input } from 'antd'
import { isValidPhoneNumber } from 'libphonenumber-js'

const PublicAppointmentPersonalDetails = () => {
    return (
        <div>
            <Form.Item
                name="name"
                label={<p className="text-xs font-bold uppercase tracking-widest">Teljes név</p>}
                rules={[{ required: true, message: 'Kérjük add meg a teljes nevedet!' }]}
            >
                <Input placeholder="Vendég neve..." />
            </Form.Item>

            <Form.Item
                name="email"
                label={<p className="text-xs font-bold uppercase tracking-widest">Email</p>}
                rules={[{ required: true, message: 'E-mail címed...' }]}
            >
                <Input placeholder="E-mail címed..." />
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                label={<p className="text-xs font-bold uppercase tracking-widest">Telefonszám</p>}
                rules={[
                    {
                        required: true, message: 'Telefonszám...'
                    },
                    {
                        validator(_, value) {
                            if (!value || isValidPhoneNumber(value)) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Érvénytelen telefonszám formátum!");
                        },
                    },
                ]}
            >
                <Input placeholder="Telefonszámod..." />
            </Form.Item>
        </div>
    )
}

export default PublicAppointmentPersonalDetails
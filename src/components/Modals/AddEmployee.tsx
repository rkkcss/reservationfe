import { Alert, Button, Form, Input, Modal } from 'antd'
import addEmployee from '../../assets/addEmployee.svg'


type AddEmployeeProps = {
    open: boolean,
    onCancel: () => void,
}

const AddEmployee = ({ open, onCancel }: AddEmployeeProps) => {
    return (
        <Modal open={open} onCancel={onCancel} footer={false} title="Kolléga meghívás">
            <div className="flex justify-center">
                <img src={addEmployee} alt="Add Employee" className="my-4 h-40" />
            </div>
            <Alert
                message="Küldj meghívó e-mail-t annak akit szeretnél kollégádnak. Amint elfogadja a meghívót, kollégáddá válik."
                type="info"
                showIcon
                className="mb-4"
            />
            <Form layout="vertical">
                <Form.Item
                    label="E-mail"
                    rules={[{ required: true, message: "Kötelező mező" }]}
                    name="email"
                >
                    <Input placeholder="E-mail cím..." type="email" />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full mt-3">Küldés</Button>
            </Form>
            {/* Add form for adding new employee */}

        </Modal>
    )
}

export default AddEmployee
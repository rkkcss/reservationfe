import { Button, Form, Input, message } from 'antd'
import { patchUserLogin } from '../helpers/queries/accountService';

type ChangeLoginNameProps = {
    login: string | undefined,
}

const ChangeLoginName = ({ login }: ChangeLoginNameProps) => {
    const handleSubmit = (values: string) => {
        patchUserLogin(values)
            .then(() => {
                message.success("Sikeres módosítás!")
            })
            .catch(err => {
                message.error(err.response.data.detail)
            })
    }
    return (
        <>
            <p className="text-xl font-semibold mb-6 mt-4">Felhasználónév változtatás</p>
            <Form
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Felhasználónév"
                    rules={[
                        { required: true, message: "Kötelező mező!" },
                        { min: 1, message: "Legalább 1 karakternek kell lennie!" },
                        { max: 50, message: "Legalább 50 karakternek kell lennie!" },
                    ]}
                    name="login"
                    initialValue={login}
                >
                    <Input placeholder="Felhasználónév..." />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full sm:w-fit">
                    Módosít
                </Button>
            </Form>
        </>
    )
}

export default ChangeLoginName
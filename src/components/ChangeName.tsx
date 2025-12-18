import { Button, Form, Input } from 'antd'
import { patchUserName } from '../helpers/queries/account-queries'
import { ChangeUserName } from '../helpers/types/ChangeUserName'
import { updateName } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import { AxiosError } from 'axios'

const ChangeName = ({ firstName, lastName }: ChangeUserName) => {
    const dispatch = useDispatch()
    const handleSubmit = (values: ChangeUserName) => {
        patchUserName(values).then((res) => {
            if (res.status === 200) {
                dispatch(updateName({ firstName: values.firstName, lastName: values.lastName }));
            }
        }).catch((err: AxiosError) => {
            console.error(err.message);
        })
    }
    return (
        <>
            <p className="text-xl font-semibold mb-6">Név modosítás</p>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Vezetéknév"
                    name="firstName"
                    initialValue={firstName}
                    rules={[
                        {
                            required: true,
                            message: 'A vezetéknév megadása kötelező.',
                        },
                        {
                            min: 2,
                            message: 'A vezetéknév legalább 2 karakterből álljon.',
                        },
                        {
                            max: 50,
                            message: 'A vezetéknév legfeljebb 50 karakterből lehet.',
                        }
                    ]}
                >
                    <Input placeholder="Vezetéknév..." />
                </Form.Item>

                <Form.Item label="Keresztnév" name="lastName" initialValue={lastName}
                    rules={[
                        {
                            required: true,
                            message: 'A keresztnév megadása kötelező.',
                        },
                        {
                            min: 2,
                            message: 'A keresztnév legalább 2 karakterből álljon.',
                        },
                        {
                            max: 50,
                            message: 'A keresztnév legfeljebb 50 karakterből lehet.',
                        }
                    ]}
                >
                    <Input placeholder="Keresztnév..." />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full sm:w-fit">Módosít</Button>

            </Form>
        </>
    )
}

export default ChangeName
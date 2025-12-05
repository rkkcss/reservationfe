import { Button, Form, notification, Radio } from 'antd'
import { useEffect } from 'react'
import blackTheme from '../assets/black-theme.png'
import orangeTheme from '../assets/orange-theme.png'
import blueTheme from '../assets/blue-theme.png'
import defaultTheme from '../assets/default-theme.png'
import pinkTheme from '../assets/pink-theme.png'
import { useForm } from 'antd/es/form/Form'
import { changeBusinessTheme } from '../helpers/queries/business-queries'

type SettingsThemeSelectorProps = {
    theme: string,
    setBusinessTheme: (theme: string) => void
}

const SettingsThemeSelector = ({ theme, setBusinessTheme }: SettingsThemeSelectorProps) => {
    const [form] = useForm();

    useEffect(() => {
        const lowerCaseTheme = theme;
        form.setFieldValue("theme", lowerCaseTheme);
    }, [theme, form])

    const handleThemeChange = ({ theme }: { theme: string }) => {
        setBusinessTheme(theme);
        changeBusinessTheme({ theme })
            .then(res => {
                if (res.status === 200) {
                    notification.success({ message: "Sikeresen megváltoztattad az oldalad témáját!", placement: "bottom" })
                }
            })
    }

    return (
        <div className="mt-12">
            <p className="text-lg mb-2 mt-4 font-semibold">Oldalad témájának módosítása</p>
            <Form form={form} layout="vertical" id="theme-chang" onFinish={handleThemeChange}>
                <Form.Item name="theme">
                    <Radio.Group rootClassName="flex w-full justify-between" options={
                        [
                            {
                                value: "BLACK",
                                label: (
                                    <>
                                        <img src={blackTheme} className="w-32" />
                                        <p className="text-center">Fekete</p>
                                    </>
                                )
                            },
                            {
                                value: "ORANGE",
                                label: (
                                    <>
                                        <img src={orangeTheme} className="w-32" />
                                        <p className="text-center">Narancs</p>
                                    </>
                                )
                            },
                            {
                                value: "BLUE",
                                label: (
                                    <>
                                        <img src={blueTheme} className="w-32" />
                                        <p className="text-center">Kék</p>
                                    </>
                                )
                            },
                            {
                                value: "DEFAULT",
                                label: (
                                    <>
                                        <img src={defaultTheme} className="w-32" />
                                        <p className="text-center">Alap</p>
                                    </>
                                )
                            },
                            {
                                value: "PINK",
                                label: (
                                    <>
                                        <img src={pinkTheme} className="w-32" />
                                        <p className="text-center">Pink</p>
                                    </>
                                )
                            }
                        ]
                    }>
                    </Radio.Group>
                </Form.Item>
                <Button type="primary" htmlType="submit">Mentés</Button>
            </Form>
        </div>
    )
}

export default SettingsThemeSelector
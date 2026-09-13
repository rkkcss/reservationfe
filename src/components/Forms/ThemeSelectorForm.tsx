import { Button, Form, FormInstance, notification, Radio } from "antd";
import blackTheme from "../../assets/black-theme.png";
import orangeTheme from "../../assets/orange-theme.png";
import blueTheme from "../../assets/blue-theme.png";
import defaultTheme from "../../assets/default-theme.png";
import pinkTheme from "../../assets/pink-theme.png";
import { changeBusinessTheme } from "../../helpers/queries/business-queries";
import { useAppDispatch } from "../../store/hooks";
import { changeBusinessThemeDispatch } from "../../redux/userSlice";
import { ReactNode } from "react";

type Props = {
    form: FormInstance;
    onFinish?: ({ theme }: { theme: string }) => void;
    finishBtnText?: string;
    footer?: boolean;
    customFooter?: ReactNode;
};

const ThemeSelectorForm = ({
    form,
    onFinish,
    finishBtnText,
    footer = true,
    customFooter,
}: Props) => {
    const dispatch = useAppDispatch();
    const defaultOnFinish = ({ theme }: { theme: string }) => {
        if (onFinish) {
            onFinish({ theme });
        } else {
            handleThemeChange({ theme: theme });
        }
    };

    const handleThemeChange = ({ theme }: { theme: string }) => {
        dispatch(changeBusinessThemeDispatch(theme));
        changeBusinessTheme({ theme }).then((res) => {
            if (res.status === 200) {
                notification.success({
                    title: "Sikeresen megváltoztattad az oldalad témáját!",
                    placement: "bottom",
                });
            }
        });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            id="theme-chang"
            onFinish={defaultOnFinish}
        >
            <Form.Item name="theme">
                <Radio.Group
                    rootClassName="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-between"
                    options={[
                        {
                            value: "BLACK",
                            label: (
                                <>
                                    <img src={blackTheme} className="w-32" />
                                    <p className="text-center">Fekete</p>
                                </>
                            ),
                        },
                        {
                            value: "ORANGE",
                            label: (
                                <>
                                    <img src={orangeTheme} className="w-32" />
                                    <p className="text-center">Narancs</p>
                                </>
                            ),
                        },
                        {
                            value: "BLUE",
                            label: (
                                <>
                                    <img src={blueTheme} className="w-32" />
                                    <p className="text-center">Kék</p>
                                </>
                            ),
                        },
                        {
                            value: "DEFAULT",
                            label: (
                                <>
                                    <img src={defaultTheme} className="w-32" />
                                    <p className="text-center">Alap</p>
                                </>
                            ),
                        },
                        {
                            value: "PINK",
                            label: (
                                <>
                                    <img src={pinkTheme} className="w-32" />
                                    <p className="text-center">Pink</p>
                                </>
                            ),
                        },
                    ]}
                ></Radio.Group>
            </Form.Item>
            {footer ? (
                <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full sm:w-fit mt-4"
                >
                    {finishBtnText ? finishBtnText : "Mentés"}
                </Button>
            ) : (
                customFooter
            )}
        </Form>
    );
};

export default ThemeSelectorForm;

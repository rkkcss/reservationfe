import { notification } from "antd";
import { useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { changeBusinessTheme } from "../../helpers/queries/business-queries";
import ThemeSelectorForm from "../Forms/ThemeSelectorForm";

type SettingsThemeSelectorProps = {
    theme: string;
    setBusinessTheme: (theme: string) => void;
};

const SettingsThemeSelector = ({
    theme,
    setBusinessTheme,
}: SettingsThemeSelectorProps) => {
    const [form] = useForm();

    useEffect(() => {
        const lowerCaseTheme = theme;
        form.setFieldValue("theme", lowerCaseTheme);
    }, [theme, form]);

    const handleThemeChange = ({ theme }: { theme: string }) => {
        setBusinessTheme(theme);
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
        <div className="mt-12">
            <p className="text-lg mb-2 mt-4 font-semibold">
                Oldalad témájának módosítása
            </p>
            <ThemeSelectorForm form={form} onFinish={handleThemeChange} />
        </div>
    );
};

export default SettingsThemeSelector;

import { useTranslation } from "react-i18next";
import NavBar from "../components/NavBar";
import { Button } from "antd";

type Props = {}

const Home = (props: Props) => {
    const { t, i18n: { changeLanguage, language } } = useTranslation();
    return (
        <>
            <p className="text-4xl">{t('welcome')} {language}</p>
            <Button type="primary">ez egy gomb</Button>
        </>
    )
}

export default Home;
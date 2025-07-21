import { Dropdown } from 'antd/lib';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';

const languages = [
    {
        key: "en",
        label: "English",
    },
    {
        key: "hu",
        label: "Magyar",
    },
];

export default function LanguageSelector() {
    const { i18n: { changeLanguage, language } } = useTranslation();

    return (
        <Dropdown arrow menu={{ items: languages, selectable: true, defaultSelectedKeys: [language], onSelect: (e) => changeLanguage(e.key) }} trigger={['click']}>
            <MdLanguage size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
        </Dropdown>
    );
}

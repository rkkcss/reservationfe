import { Dropdown } from 'antd/lib';
import { useTranslation } from 'react-i18next';
import { IoMdArrowDropdown } from 'react-icons/io';
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
        <Dropdown arrow={{ pointAtCenter: true }}
            placement="bottomRight"
            menu={{
                items: languages,
                selectable: true,
                defaultSelectedKeys: [language],
                onSelect: (e) => changeLanguage(e.key)
            }}
            trigger={['click']}
        >
            <div className="flex items-center gap-0.5 cursor-pointer">
                <MdLanguage size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
                <IoMdArrowDropdown size={14} className=" group-hover:text-primary mt-1" />
            </div>
        </Dropdown>
    );
}

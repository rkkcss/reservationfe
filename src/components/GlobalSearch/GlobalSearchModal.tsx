import { AutoComplete, Input, Modal } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { FiSearch } from "react-icons/fi";
import { SearchOption } from "./useGlobalSearchOptions";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect, useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    options: SearchOption[];
    onSearch: (value: string) => void;
    onSelect: (value: string, option: DefaultOptionType) => void;
}


export const GlobalSearchModal = ({ open, onClose, options, onSearch, onSelect }: Props) => {
    const [inputValue, setInputValue] = useState('');
    const debouncedValue = useDebounce(inputValue, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue]);

    return (
        <Modal open={open} onCancel={onClose} footer={null} closable={false} width={600}
            className="!p-0 [&_.ant-modal-container]:!p-0 [&_.ant-modal-container]:rounded-full"
        >
            <AutoComplete
                autoFocus
                className="!relative w-full text-lg !rounded-full [&_.ant-select-selector]:!rounded-full"
                placeholder="Írj be egy nevet vagy email címet..."
                options={options as DefaultOptionType[]}
                placement="bottomLeft"
                showSearch={{ onSearch: setInputValue }}
                onSelect={onSelect}
            >
                <Input
                    size="large"
                    prefix={<FiSearch className="text-xl text-gray-400 mr-2" />}
                    className="h-full !rounded-full"
                />
            </AutoComplete>
        </Modal>
    )
};
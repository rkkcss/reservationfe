import { AutoComplete, Modal } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { FiSearch } from "react-icons/fi";
import { SearchOption } from "./useGlobalSearchOptions";

type Props = {
    open: boolean;
    onClose: () => void;
    options: SearchOption[];
    onSearch: (value: string) => void;
    onSelect: (value: string, option: DefaultOptionType) => void;
}

export const GlobalSearchModal = ({ open, onClose, options, onSearch, onSelect }: Props) => (
    <Modal open={open} onCancel={onClose} footer={null} closable={false} width={600}
        className="!p-0 [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:rounded-full"
    >
        <AutoComplete
            autoFocus
            className="!relative w-full h-12 text-lg !rounded-xl [&_.ant-select-selector]:!rounded-full ..."
            placeholder="Írj be egy nevet vagy email címet..."
            prefix={<FiSearch className="text-xl text-gray-400 mr-2" />}
            options={options as DefaultOptionType[]}
            popupClassName="!mt-12"
            dropdownAlign={{ points: ['tl', 'bl'], offset: [0, 14] }}
            onSearch={onSearch}
            onSelect={onSelect}
        />
    </Modal>
);
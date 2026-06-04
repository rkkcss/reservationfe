import { SearchTriggerButton } from "./SearchTriggerButton";
import useGlobalSearch from "./useGlobalSearch";
import { useState } from "react";
import { useGlobalSearchOptions } from "./useGlobalSearchOptions";
import { GlobalSearchModal } from "./GlobalSearchModal";

const GlobalSearch = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setQString, qString } = useGlobalSearch();
    const { getFormattedOptions } = useGlobalSearchOptions(data, qString);

    const handleSelect = () => {

    }

    return (
        <>
            <SearchTriggerButton onClick={() => setIsModalOpen(true)} />
            <GlobalSearchModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                options={getFormattedOptions()}
                onSearch={setQString}
                onSelect={handleSelect}
            />
        </>
    );
};

export default GlobalSearch
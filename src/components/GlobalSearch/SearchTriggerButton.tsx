import { useEffect } from "react";
import { FiSearch } from "react-icons/fi";

interface Props {
    onClick: () => void;
}

export const SearchTriggerButton = ({ onClick }: Props) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlOrCmd = event.ctrlKey || event.metaKey;

            if (isCtrlOrCmd && event.key.toLowerCase() === 'k') {
                event.preventDefault();

                console.log('Ctrl + K megnyomva!');
                onClick();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <button
            onClick={onClick}
            className="w-96 md:flex h-10 hidden items-center gap-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-400 rounded-full border border-gray-200 transition-all text-left"
        >
            <FiSearch className="text-gray-500 text-lg" />
            <span>Keresés...</span>
            <span className="ml-auto text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">Ctrl + K</span>
        </button>)
};
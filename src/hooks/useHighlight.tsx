export const useHighlight = () => {
    const highlightText = (text: string, searchWords: string) => {
        if (!searchWords || !text) return <span>{text}</span>;
        const regex = new RegExp(`(${searchWords.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part)
                        ? <span key={i} className="bg-yellow-300 text-black rounded-sm font-medium">{part}</span>
                        : part
                )}
            </span>
        );
    };
    return { highlightText };
};
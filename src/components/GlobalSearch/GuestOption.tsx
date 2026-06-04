import { Guest } from "../../helpers/types/Guest";

interface Props {
    item: Guest;
    highlight: (text: string) => React.ReactNode;
}

export const GuestOption = ({ item, highlight }: Props) => (
    <div className="flex flex-col p-1">
        <span style={{ fontWeight: 500, color: '#333' }}>
            {highlight(item.name)}
        </span>
        <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
            {highlight(item.email)}
        </span>
    </div>
);
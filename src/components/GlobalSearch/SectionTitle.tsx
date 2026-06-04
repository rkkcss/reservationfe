type Props = {
    title: string;
}

export const SectionTitle = ({ title }: Props) => (
    <div className="flex items-center justify-between py-1 border-b border-b-gray-200" >
        <span className="font-semibold text-black text-sm" >{title}</span>
    </div>
);
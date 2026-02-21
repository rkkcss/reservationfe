import { Form, Select } from "antd";
import AddOrEditGuestModalWButton from "../AddOrEditGuestModalWButton";
import { Guest } from "../../../helpers/types/Guest";

type GuestSelectorProps = {
    options: Guest[];
    onSearch: (value: string) => void;
    isEditing: boolean;
    afterGuestSubmit: () => void;
}

export const GuestSelector = ({ options, onSearch, isEditing, afterGuestSubmit }: GuestSelectorProps) => (
    <div className="flex items-center gap-2">
        <Form.Item label="Vendég" name="guestId" className="flex-1">
            <Select
                showSearch
                variant={isEditing ? "outlined" : "borderless"}
                onSearch={onSearch}
                options={options.map(g => ({ label: g.name, value: g.id }))}
            />
        </Form.Item>
        {isEditing && <AddOrEditGuestModalWButton afterSubmit={afterGuestSubmit} />}
    </div>
);
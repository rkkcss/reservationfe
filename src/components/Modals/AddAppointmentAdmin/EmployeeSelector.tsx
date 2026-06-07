import { Form, Select } from "antd";
import { BusinessEmployee } from "../../../helpers/types/BusinessEmployee";

type EmployeeFormSelectorProps = {
    options: BusinessEmployee[];
    loadOptions: () => void;
};

export const EmployeeFormSelector = ({ options, loadOptions }: EmployeeFormSelectorProps) => {
    return (
        <Form.Item label="Munkatárs" name="employeeId">
            <Select
                onOpenChange={(open) => open && loadOptions()}
                showSearch
                optionFilterProp="label"
                placeholder="Válassz munkatársat..."
                allowClear
                optionLabelProp="label"
                options={options.map(e => ({
                    label: `${e.user.fullName}`,
                    value: e.user.id
                }))}
            >
            </Select>
        </Form.Item>
    );
};
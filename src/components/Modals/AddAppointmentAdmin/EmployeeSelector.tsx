import { Form, Select } from "antd";
import { BusinessEmployee } from "../../../helpers/types/BusinessEmployee";

type EmployeeSelectorProps = {
    options: BusinessEmployee[];
    loadOptions: () => void;
};

export const EmployeeSelector = ({ options, loadOptions }: EmployeeSelectorProps) => {
    return (
        <Form.Item label="Munkatárs" name="employeeId">
            <Select
                onDropdownVisibleChange={(open) => open && loadOptions()}
                showSearch
                optionFilterProp="label"
                placeholder="Válassz munkatársat..."
                allowClear
                optionLabelProp="label"
                options={options.map(e => ({
                    label: `${e.user.firstName} ${e.user.lastName}`,
                    value: e.user.id
                }))}
            >
            </Select>
        </Form.Item>
    );
};
import { Form, Select } from 'antd';
import { CgSandClock } from "react-icons/cg";
import { MdCheckCircleOutline } from 'react-icons/md';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { TFunction } from 'i18next';

export const StatusSelector = ({ t }: { t: TFunction }) => (
    <Form.Item
        name="status"
        label={t("status")}
        rules={[{ required: true, message: t("required") }]}
    >
        <Select placeholder="Időpont státusza">
            <Select.Option value="PENDING" label="PENDING">
                <div className="flex items-center gap-1">
                    <CgSandClock size={20} />
                    <span>{t("pendingApproval")}</span>
                </div>
            </Select.Option>
            <Select.Option value="CONFIRMED" label="CONFIRMED">
                <div className="flex items-center gap-1">
                    <MdCheckCircleOutline size={20} className="text-green-500" />
                    <span>{t("confirmed")}</span>
                </div>
            </Select.Option>
            <Select.Option value="CANCELLED" label="CANCELLED">
                <div className="flex items-center gap-1">
                    <IoCloseCircleOutline size={20} strokeWidth={2} className="text-red-500" />
                    <span>{t("rejected")}</span>
                </div>
            </Select.Option>
        </Select>
    </Form.Item>
);
import { Button, Card, Form, Input, InputRef, Space, Tag } from "antd";
import { MouseEvent, useRef, useState } from "react";
import { useSlugAvailability } from "./useSlugAvailability";
import { getMainDomain } from "../../../hooks/useTenantSlug";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useForm } from "antd/es/form/Form";
import { Business } from "../../../helpers/types/Business";
import { onboardingDetailsStepPostQuery } from "../../../helpers/queries/onboarding-queries";
import { useAppDispatch } from "../../../store/hooks";
import { setActiveBusinessEmployee } from "../../../redux/userSlice";

type Props = {
    onNext: (event?: MouseEvent<HTMLButtonElement>) => void;
    onLoadingChange: (loading: boolean) => void;
};

const StepBusinessInfo = ({ onNext, onLoadingChange }: Props) => {
    const [form] = useForm();
    const dispatch = useAppDispatch();
    const [isSlugCustomized, setIsSlugCustomized] = useState(false);
    const slugInputRef = useRef<InputRef>(null);
    const {
        suggestions,
        setSuggestions,
        checkAvailability,
        confirmAvailable,
        isConfirmedAvailable,
        resetConfirmation,
    } = useSlugAvailability();

    const mainDomain = getMainDomain();

    const sanitizeCharacters = (value: string) =>
        value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-");

    const sanitizeSlugInput = (value: string) =>
        sanitizeCharacters(value.trim());

    const trimSlugEdges = (value: string) => value.replace(/^-+|-+$/g, "");

    const slugify = (text: string) => {
        return trimSlugEdges(sanitizeSlugInput(text.toString()));
    };

    const getSanitizedCursorOffset = (
        rawValueBeforeSanitize: string,
        cursorPosBeforeSanitize: number,
    ) => {
        const prefix = rawValueBeforeSanitize.slice(0, cursorPosBeforeSanitize);
        return sanitizeCharacters(prefix).length;
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isSlugCustomized) {
            const generatedSlug = slugify(value);
            form.setFieldsValue({ slug: generatedSlug });
            form.validateFields(["slug"]);
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSlugCustomized) {
            setIsSlugCustomized(true);
        }
        const rawValue = e.target.value;
        const cursorPos = e.target.selectionStart ?? rawValue.length;
        const sanitized = sanitizeSlugInput(rawValue);

        if (sanitized !== rawValue) {
            const newCursorPos = getSanitizedCursorOffset(rawValue, cursorPos);

            form.setFieldsValue({ slug: sanitized });

            requestAnimationFrame(() => {
                const inputEl = slugInputRef.current?.input;
                if (inputEl) {
                    inputEl.setSelectionRange(newCursorPos, newCursorPos);
                }
            });
        }
    };

    const handleSlugBlur = () => {
        const current = form.getFieldValue("slug") ?? "";
        const cleaned = trimSlugEdges(current);
        if (cleaned !== current) {
            form.setFieldsValue({ slug: cleaned });
            form.validateFields(["slug"]);
        }
    };

    const handleSelectSuggestion = (suggestedSlug: string) => {
        confirmAvailable(suggestedSlug);
        setIsSlugCustomized(true);
        form.setFieldsValue({ slug: suggestedSlug });
        form.validateFields(["slug"]);
    };

    const handleNext = async (data: Business) => {
        onLoadingChange(true);
        await onboardingDetailsStepPostQuery(data)
            .then((res) => {
                if (res.status === 201) {
                    dispatch(
                        setActiveBusinessEmployee(res.data.businessEmployee),
                    );
                    onNext();
                }
            })
            .then(() => onLoadingChange(false));
    };

    return (
        <div>
            <Form form={form} onFinish={handleNext} layout="vertical">
                <Card classNames={{ body: "!py-2" }}>
                    <Form.Item
                        label="Üzlet neve"
                        name="name"
                        rules={[{ required: true, message: "Kötelező mező!" }]}
                    >
                        <Input
                            placeholder="pl. Komoly Barber Budapest..."
                            onChange={handleNameChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Leírása"
                        name="description"
                        rules={[{ required: true, message: "Kötelező mező!" }]}
                    >
                        <Input.TextArea placeholder="Üzlet rövid leírása..." />
                    </Form.Item>

                    <Form.Item
                        label="Üzlet egyedi webcíme (Subdomain)"
                        required
                    >
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                style={{ width: "20%", textAlign: "center" }}
                                disabled
                                defaultValue="https://"
                            />

                            <Form.Item
                                name="slug"
                                noStyle
                                validateTrigger={["onBlur"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Kötelező mező!",
                                    },
                                    {
                                        pattern: /^[a-z0-9-]+$/,
                                        message:
                                            "Csak kisbetűket, számokat és kötőjelet tartalmazhat!",
                                    },
                                    {
                                        validator: async (_, value) => {
                                            if (
                                                !value ||
                                                value.trim().length < 2
                                            ) {
                                                setSuggestions([]);
                                                return Promise.resolve();
                                            }

                                            if (isConfirmedAvailable(value)) {
                                                setSuggestions([]);
                                                return Promise.resolve();
                                            }
                                            resetConfirmation();

                                            const res =
                                                await checkAvailability(value);

                                            if (
                                                form.getFieldValue("slug") !==
                                                value
                                            ) {
                                                return Promise.resolve();
                                            }

                                            if (!res.available) {
                                                setSuggestions(
                                                    res.suggestions || [],
                                                );
                                                return Promise.reject(
                                                    new Error(
                                                        "Ez a webcím nem elérhető vagy már foglalt!",
                                                    ),
                                                );
                                            }

                                            setSuggestions([]);
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    ref={slugInputRef}
                                    style={{ width: "50%" }}
                                    placeholder="komoly-barber"
                                    onChange={handleSlugChange}
                                    onBlur={handleSlugBlur}
                                />
                            </Form.Item>

                            <Input
                                style={{ width: "30%" }}
                                disabled
                                value={`.${mainDomain}`}
                            />
                        </Space.Compact>

                        {suggestions.length > 0 && (
                            <div className="flex gap-2 my-2">
                                {suggestions.map((sug) => (
                                    <Tag
                                        className="cursor-pointer hover:border-blue-400"
                                        key={sug}
                                        color="blue"
                                        onClick={() =>
                                            handleSelectSuggestion(sug)
                                        }
                                    >
                                        {sug}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Telefonszám"
                        rules={[
                            {
                                required: true,
                                message: "Telefonszám...",
                            },
                            {
                                validator(_, value) {
                                    if (!value || isValidPhoneNumber(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        "Érvénytelen telefonszám formátum!",
                                    );
                                },
                            },
                        ]}
                    >
                        <Input placeholder="Telefonszámod..." />
                    </Form.Item>

                    <Form.Item
                        label="Üzlet cím"
                        name="address"
                        rules={[{ required: true, message: "Kötelező mező!" }]}
                    >
                        <Input placeholder="pl 1012 Budapest xy utca 12 ..." />
                    </Form.Item>
                </Card>
                <div className="flex justify-end mt-4">
                    <Button type="primary" htmlType="submit">
                        Következő
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default StepBusinessInfo;

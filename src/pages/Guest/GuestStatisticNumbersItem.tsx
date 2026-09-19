import { Card } from "antd";
import { mergeClasses } from "../../utils/mergeClasses";

type ClassNames = {
    root?: string;
    text?: string;
    value?: string;
};

type Props = {
    text: string;
    value: string | number;
    className?: string;
    classNames?: ClassNames;
};

const GuestStatisticNumbersItem = ({
    text,
    value,
    className,
    classNames,
}: Props) => {
    return (
        <Card
            className={mergeClasses(
                "flex flex-col gap-2 flex-1 w-full",
                classNames?.root,
                className,
            )}
        >
            <p className={mergeClasses("m-0 text-base", classNames?.text)}>
                {text}
            </p>
            <p
                className={mergeClasses(
                    "text-2xl font-semibold mt-2",
                    classNames?.value,
                )}
            >
                {value}
            </p>
        </Card>
    );
};

export default GuestStatisticNumbersItem;

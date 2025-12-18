import dayjs from 'dayjs';
import { LuCalendarDays, LuCircleUserRound, LuClock, LuMail, LuPhone } from 'react-icons/lu';
import { MdOutlineDesignServices } from 'react-icons/md';

type StepConfirmProps = {
    form: any;
}

const FORM_ITEMS = {
    phoneNumber: "Telefonszám",
    name: "Név",
    email: "Email",
    offeringId: "Szolgáltatás",
    time: "Idő",
    date: "Dátum",
}

const ICONS: Record<string, JSX.Element> = {
    name: <LuCircleUserRound size={30} />,
    email: <LuMail size={30} />,
    phoneNumber: <LuPhone size={30} />,
    date: <LuCalendarDays size={30} />,
    time: <LuClock size={30} />,
    offeringId: <MdOutlineDesignServices size={30} />
}

const StepConfirm = ({ form }: StepConfirmProps) => {
    return (
        <div>
            <div className="flex flex-col gap-2">
                {
                    Object.entries(form.getFieldsValue(true)).map(([key, value]) => {
                        if (key === "date" || key === "time") return null;

                        return (
                            <div key={key} className="flex items-center gap-3 py-3 px-2 rounded-lg outline outline-gray-300 outline-1">
                                <div className="p-2 bg-gray-200 rounded-full">
                                    {ICONS[key] ?? <LuCircleUserRound size={30} />}
                                </div>
                                <div>
                                    <p className="font-bold text-base">
                                        {FORM_ITEMS[key as keyof typeof FORM_ITEMS]}:
                                    </p>
                                    <p className="text-sm">
                                        {dayjs.isDayjs(value) ? value.format("YYYY.MM.DD") : value?.toString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                }

                {/* Dátum + Idő egy sorban */}
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 py-4 px-2 outline outline-gray-300 outline-1 rounded-lg w-full">
                        <div className="p-2 bg-gray-200 rounded-full">
                            <LuCalendarDays size={30} />
                        </div>
                        <div>
                            <p className="font-bold text-base">{FORM_ITEMS["date"]}</p>
                            <p className="text-sm">{dayjs(form.getFieldValue("date")).format("YYYY.MM.DD")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 py-4 px-2 outline outline-gray-300 outline-1 rounded-lg w-full">
                        <div className="p-2 bg-gray-200 rounded-full">
                            <LuClock size={30} />
                        </div>
                        <div>
                            <p className="font-bold text-base">{FORM_ITEMS["time"]}</p>
                            <p className="text-sm">{form.getFieldValue("time")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StepConfirm
import { Button, Collapse, Tooltip } from "antd"
import { Offering } from "../../helpers/types/Offering";
import { CiClock2 } from "react-icons/ci";
import { useBusinessConfigProvider } from "../../context/ConfigProviderBusinessContext";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

type BusinessServiceProps = {
    offer: Offering;
    handleReservationButton: (e: React.MouseEvent, offer: Offering) => void;
}

const BusinessService = ({ offer, handleReservationButton }: BusinessServiceProps) => {
    const { selectedTheme } = useBusinessConfigProvider();
    return (
        <Collapse
            bordered={true}
            className={`mb-5`}
            expandIcon={({ isActive }) => isActive ? <FaChevronDown style={{ color: selectedTheme.primaryTextColor }} /> : <FaChevronRight style={{ color: selectedTheme.primaryTextColor }} />}
        >
            <Collapse.Panel
                key={offer.id}
                header={
                    <p style={{ color: selectedTheme.secondaryTextColor }}>
                        {offer.title}
                    </p>
                }
                extra={
                    <div className="flex items-center gap-5">
                        <Tooltip
                            title="Szolgáltatás időtartama"
                            className="flex items-center gap-2 h-full"
                        >
                            <CiClock2 strokeWidth={1} size={16} style={{ color: selectedTheme.secondaryTextColor }} />
                            <span style={{ color: selectedTheme.secondaryTextColor }}>{offer.durationMinutes} perc</span>
                        </Tooltip>
                        <div className="text-slate-600 font-bold flex items-baseline"
                            style={{ color: selectedTheme.secondaryTextColor }}
                        >
                            {offer.price?.toFixed(0)} Ft
                        </div>
                        <Button
                            type="primary"
                            onClick={(e) => handleReservationButton(e, offer)}
                        >
                            Foglalás
                        </Button>
                    </div>
                }
            >
                <p className="text-xs"
                    style={{ color: selectedTheme.secondaryTextColor }}
                >{offer.description}</p>
            </Collapse.Panel>
        </Collapse>
    )
}

export default BusinessService
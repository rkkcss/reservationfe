import { Button, Collapse, Tooltip, Typography } from "antd"
import { Offering } from "../../helpers/types/Offering";
import { CiClock2 } from "react-icons/ci";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

type BusinessServiceProps = {
    offer: Offering;
    handleReservationButton: (e: React.MouseEvent, offer: Offering) => void;
}

const BusinessService = ({ offer, handleReservationButton }: BusinessServiceProps) => {
    return (
        <Collapse
            bordered={true}
            className={`mb-5`}
            expandIcon={({ isActive }) => isActive ? <FaChevronDown /> : <FaChevronRight />}
        >
            <Collapse.Panel
                key={offer.id}
                header={
                    <Typography.Paragraph>
                        {offer.title}
                    </Typography.Paragraph>
                }
                extra={
                    <div className="flex items-center gap-5">
                        <Tooltip
                            title="Szolgáltatás időtartama"
                            className="flex items-center gap-2 h-full"
                        >
                            <CiClock2 strokeWidth={1} size={16} />
                            <Typography.Text>{offer.durationMinutes} perc</Typography.Text>
                        </Tooltip>
                        <Typography className="flex items-baseline">
                            {offer.price?.toFixed(0)} Ft
                        </Typography>
                        <Button
                            type="primary"
                            onClick={(e) => handleReservationButton(e, offer)}
                        >
                            Foglalás
                        </Button>
                    </div>
                }
            >
                <Typography>{offer.description}</Typography>
            </Collapse.Panel>
        </Collapse>
    )
}

export default BusinessService
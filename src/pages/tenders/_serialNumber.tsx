import { useParams } from "react-router-dom";

export default function() {
    const { serialNumber } = useParams();

    return (
        <div>Tender {serialNumber}</div>
    )
}
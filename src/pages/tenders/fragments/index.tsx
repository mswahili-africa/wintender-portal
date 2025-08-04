import Tabs from "@/components/widgets/Tabs";
import InternationalTenders from "../international-tenders";
import GovernmentTenders from "../government-tenders";
import PrivateTenders from "../private-tenders";

export default function TenderList() {


    return (
        <div>
            <Tabs panels={["Government","Private", "International"]}>
                <GovernmentTenders />
                <PrivateTenders />
                <InternationalTenders />
            </Tabs>
        </div>
    )
}
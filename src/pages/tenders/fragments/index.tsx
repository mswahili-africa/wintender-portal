import Tabs from "@/components/widgets/Tabs";
import InternationalTenders from "../international-tenders";
import PrivateTenders from "../private-tenders";

export default function TenderList() {


    return (
        <div>
            <Tabs panels={["Private", "International"]}>
                <PrivateTenders />
                <InternationalTenders />
            </Tabs>
        </div>
    )
}
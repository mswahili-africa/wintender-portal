import Tabs from "@/components/widgets/Tabs";
import LocalTenders from "../local-tenders";
import InternationalTenders from "../international-tenders";


export default function TenderList() {
    

    return (
        <div>
            <Tabs panels={["Local", "International"]}>
                <LocalTenders />

                <InternationalTenders />
            </Tabs>
        </div>
    )
}
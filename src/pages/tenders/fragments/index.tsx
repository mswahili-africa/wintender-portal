import Tabs from "@/components/widgets/Tabs";
import InternationalTenders from "../international-tenders";
import PrivateTenders from "../private-tenders";
import { useTranslation } from "react-i18next";

export default function TenderList() {
    const{t}=useTranslation();

    return (
        <div>
            <Tabs panels={[t("tender-tabs-private"), t("tender-tabs-international")]}>
                <PrivateTenders />
                <InternationalTenders />
            </Tabs>
        </div>
    )
}
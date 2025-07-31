import { TExcelColumn } from "@/components/widgets/Excel";


const bidderExcelColumns: TExcelColumn[] = [
    {
        label: "Bidder Name",
        value: "name"
    },
    {
        label: "Bidder Phone",
        value: "companyPrimaryNumber"
    },
    {
        label: "Bidder Status",
        value: "companyStatus"
    },
    {
        label: "Bidder Address",
        value: "companyAddress"
    },
    {
        label: "Bidder Email",
        value: "email"
    },
    {
        label: "Company Name",
        value: "companyName"
    },
    {
        label: "Company Email",
        value: "companyEmail"
    },
    {
        label: "Company Tin",
        value: "companyTin"
    }
];

export default bidderExcelColumns;

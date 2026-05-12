import { TExcelColumn } from "@/components/widgets/Excel";


const excelColumns:TExcelColumn[] = [
    {
        label: "User Name",
        value: "userName"
    },
    {
        label: "Company Name",
        value: "company"
    },
    {
        label: "Phone Number",
        value: "phoneNumber"
    },
    {
        label: "Amount",
        value: "amount"
    },
    {
        label: "Status",
        value: "status"
    },
    {
        label: "Date",
        value: "createdAt",
        isDate: true
    },
    {
        label: "Reason",
        value: "paymentReason"
    },
]
export default excelColumns;
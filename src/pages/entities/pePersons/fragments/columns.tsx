import { IColumn } from "@/components/widgets/table/Table";
import { IPEPerson } from "@/types";
import dummyLogo from "@/assets/images/bidder-dummy-logo.png";
import { IconMail, IconPhone, IconMapPin, IconBuilding, IconBriefcase } from "@tabler/icons-react";

const columns: IColumn[] = [
  {
    name: "firstName",
    label: "Person / Entity",
    sortable: false,
    plainObject: true,
    element: (row: IPEPerson) => {
      // Uses the S3 bucket image if available, drops back to placeholder if empty
      const imageSrc = row.passportPhoto || dummyLogo;

      return (
        <div className="flex items-center gap-3">
          <img
            src={imageSrc}
            alt={`${row.firstName}'s photo`}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
          />
          <div>
            <span className="font-medium text-gray-900 block capitalize">
              {`${row.firstName} ${row.lastName}`}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <IconBuilding size={12} className="text-gray-400 shrink-0" />
              <span className="truncate max-w-[180px]" title={row.entityName}>
                {row.entityName}
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-600 px-1.5 py-0.2 rounded font-semibold uppercase scale-90">
                {row.entityType}
              </span>
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <IconBriefcase size={12} className="text-gray-500 shrink-0" />
              <span className="truncate max-w-[180px]" title={row.entityName}>
                {row.jobTitle.trim()}
              </span>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    name: "phoneNumber",
    label: "Phone",
    sortable: false,
    plainObject: true,
    element: (row: IPEPerson) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        <IconPhone size={16} className="text-gray-400" />
        <span>{row.phoneNumber}</span>
      </div>
    ),
  },
  {
    name: "email",
    label: "Email",
    sortable: false,
    plainObject: true,
    element: (row: IPEPerson) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        <IconMail size={16} className="text-gray-400" />
        <a href={`mailto:${row.email}`} className="hover:text-blue-600 transition-colors lowercase">
          {row.email}
        </a>
      </div>
    ),
  },
  {
    name: "gender",
    label: "Gender",
    sortable: false,
    plainObject: true,
    element: (row: IPEPerson) => {
      const isMale = row.gender === "MALE";
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${
            isMale
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-purple-50 text-purple-700 border-purple-200"
          }`}
        >
          {row.gender}
        </span>
      );
    },
  },
  {
    name: "address",
    label: "Address",
    sortable: false,
    plainObject: true,
    element: (row: IPEPerson) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-600 max-w-[160px]">
        <IconMapPin size={16} className="text-gray-400 shrink-0" />
        <span className="truncate" title={row.address.trim()}>
          {row.address.trim()}
        </span>
      </div>
    ),
  },
];

export default columns;
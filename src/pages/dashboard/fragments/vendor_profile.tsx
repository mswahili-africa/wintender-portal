import { IVendorInformation } from "@/types"
import { IconUser, IconMail, IconMapPins, IconBuildingSkyscraper, IconLink, IconTrafficCone, IconPhone } from "@tabler/icons-react"
import LabelledIcon from "@/pages/dashboard/fragments/labelled_icon"

interface IProps {
    vendor: IVendorInformation
}

export default function({vendor}: IProps) {
    
    return (
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">

            <LabelledIcon 
                icon={<IconUser className="w-6 h-6" />}
                label="Name"
                value={vendor.name}
            />

            <LabelledIcon 
                icon={<IconMail className="w-6 h-6" />}
                label="Email"
                value={vendor.email}
            />

            <LabelledIcon 
                icon={<IconPhone className="w-6 h-6" />}
                label="Phone"
                value={vendor.primaryNumber}
            />

            <LabelledIcon 
                icon={<IconMapPins className="w-6 h-6" />}
                label="Address"
                value={vendor.address}
            />

            <LabelledIcon 
                icon={<IconUser className="w-6 h-6" />}
                label="Vendor"
                value={vendor.vendorType}
            />

            <LabelledIcon 
                icon={<IconLink className="w-6 h-6" />}
                label="TIN"
                value={vendor.tin}
            />

            <LabelledIcon 
                icon={<IconBuildingSkyscraper className="w-6 h-6" />}
                label="Business Licence"
                value={vendor.businessLicence}
            />

            <LabelledIcon 
                icon={<IconTrafficCone className="w-6 h-6" />}
                label="Status"
                value={vendor.status}
            />
        </div>
    )
}
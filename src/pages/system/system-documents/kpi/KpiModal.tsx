import React, { useState } from "react";
import Modal from "@/components/widgets/Modal";

import { 
  IconScale,
  IconDashboard
} from "@tabler/icons-react";
import AdministratorKpi from "./AdministratorKpi";
import BusinessLeadKpi from "./BusinessLeadKpi";
import AccountantKpi from "./AccountantKpi";
import BusinessAdministratorDataOfficerKpi from "./BusinessAdministratorKpi";
import CustomerAcquisitionRetentionOfficerKpi from "./CustomerAcquisitionRetentionOfficerKpi";
import BusinessAdministratorProcurementOfficerKpi from "./BusinessAdministrationProcurementOfficerKpi";
import SupervisorKpi from "./SupervisorKpi";
import { useUserDataContext } from "@/providers/userDataProvider";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Structured Document Groups Hierarchy
const DOCUMENT_CATEGORIES = [
  {
    group: "Key Performance Indicators (KPI)",
    items: [
      { id: "administrator", label: "Administrator KPI", icon: <IconDashboard size={16} />,role:"ADMINISTRATOR", component: <AdministratorKpi /> },
      { id: "businessLead", label: "Business Lead KPI", icon: <IconDashboard size={16} />,role:"MANAGER", component: <BusinessLeadKpi /> },
      { id: "accountantKpi", label: "Accountant KPI", icon: <IconDashboard size={16} />,role:"ACCOUNTANT", component: <AccountantKpi /> },
      { id: "businessAdministratorDataOfficerKpi", label: "BA - Data Officer KPI", icon: <IconDashboard size={16} />,role:"PUBLISHER", component: <BusinessAdministratorDataOfficerKpi /> },
      { id: "CustomerAcquisitionRetentionOfficerKpi", label: "Customer Acquisition & Retention Officer KPI", icon: <IconDashboard size={16} />,role:"SUPERVISOR", component: <CustomerAcquisitionRetentionOfficerKpi /> },
      { id: "BusinessAdministratorProcurementOfficerKpi", label: "BA - Procurement Officer KPI", icon: <IconDashboard size={16} />,role:"PUBLISHER", component: <BusinessAdministratorProcurementOfficerKpi /> },
      { id: "SupervisorKpi", label: "Supervisor KPI", icon: <IconDashboard size={16} />,role:"SUPERVISOR", component: <SupervisorKpi /> },
    ]
  }
];

export default function CompanyDocumentsModal({ isOpen, onClose }: IProps) {
  // Default to the first item (Terms and Conditions)
  const [activeTab, setActiveTab] = useState("administrator");
  const {userData} = useUserDataContext();
  const userRole = userData?.role;

  // Use effect to check currenty role and set default active tab
  React.useEffect(() => {
    const defaultActiveTab = DOCUMENT_CATEGORIES.flatMap(cat => cat.items).find(item => item.role === userRole)?.id || "administrator";
    setActiveTab(defaultActiveTab);
  }, [userRole]);

  // Flatten helper to instantly pull out the active pane payload
  const currentDocument = DOCUMENT_CATEGORIES.flatMap(cat => cat.items).find(
    item => item.id === activeTab
  );

  return (
    <Modal
      size="3xl" 
      title={"Wintender Governance & Compliance Portal Documents"}
      isOpen={isOpen}
      zIndex={30}
      onClose={onClose}
    >
      <div className="flex flex-col md:flex-row min-h-[550px] max-h-[70vh] -mx-6 -my-6 text-slate-800 antialiased">
        
        {/* LEFT SIDEBAR: STRUCTURAL COMPLIANCE CATEGORIES */}
        <aside className="w-full md:w-72 bg-zinc-50 border-r border-zinc-200 p-4 overflow-y-auto flex-shrink-0 space-y-5">
          {DOCUMENT_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {cat.group}
              </h4>
              <div className="space-y-0.5">
                {cat.items.filter(item => ["ADMINISTRATOR","MANAGER"].includes(userRole!) ? true : item.role === userRole ).map((doc) => {
                  const isActive = activeTab === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setActiveTab(doc.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold tracking-tight transition-all duration-150 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-zinc-200/60 hover:text-slate-900"
                      }`}
                    >
                      <span className={isActive ? "text-emerald-400" : "text-slate-400"}>
                        {doc.icon}
                      </span>
                      <span className="truncate">{doc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* RIGHT SIDE: SCROLLABLE MAIN REGULATORY DOCUMENT PANELS */}
        <main className="flex-1 bg-white overflow-y-auto px-8 py-6 max-h-[70vh]">
          {currentDocument ? (
            <div className="animate-fadeIn">
              {currentDocument.component}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <IconScale size={32} className="stroke-[1.5] mb-2" />
              <p className="text-xs">Select a corporate document from the directory to review legal parameters.</p>
            </div>
          )}
        </main>

      </div>
    </Modal>
  );
}
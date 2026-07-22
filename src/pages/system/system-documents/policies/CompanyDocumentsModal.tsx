import React, { useState } from "react";
import Modal from "@/components/widgets/Modal";
import EnvironmentalSustainabilityPolicy from "./EnvironmentalSustainabilityPolicy";

import { 
  IconScale, 
  IconShieldCheck, 
  IconFileSpreadsheet, 
  IconCash, 
  IconArchive, 
  IconLeaf, 
  IconUsers 
} from "@tabler/icons-react";
import DataProcessingAgreement from "./DataProcessingAgreement";
import PrivacyPolicy from "./PrivacyPolicy";
import RecordsRetentionPolicy from "./RecordsRetentionPolicy";
import SubscriptionFeeSchedule from "./SubscriptionFeeSchedule";
import SupplierCodeOfConduct from "./SupplierCodeOfConduct";
import { TermsAndConditions } from "./TermsAndConditions";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Structured Document Groups Hierarchy
const DOCUMENT_CATEGORIES = [
  {
    group: "Legal & Privacy Core",
    items: [
      { id: "terms", label: "Terms & Conditions", icon: <IconScale size={16} />, component: <TermsAndConditions /> },
      { id: "privacy", label: "Privacy Policy", icon: <IconShieldCheck size={16} />, component: <PrivacyPolicy /> },
      { id: "dpa", label: "Data Processing Agreement", icon: <IconFileSpreadsheet size={16} />, component: <DataProcessingAgreement /> },
    ]
  },
  {
    group: "Operations & Operations",
    items: [
      { id: "subscription", label: "Subscription Fee Schedule", icon: <IconCash size={16} />, component: <SubscriptionFeeSchedule /> },
      { id: "retention", label: "Records Retention Policy", icon: <IconArchive size={16} />, component: <RecordsRetentionPolicy /> },
    ]
  },
  {
    group: "Corporate Responsibility",
    items: [
      { id: "conduct", label: "Supplier Code of Conduct", icon: <IconUsers size={16} />, component: <SupplierCodeOfConduct /> },
      { id: "sustainability", label: "Environmental Sustainability", icon: <IconLeaf size={16} />, component: <EnvironmentalSustainabilityPolicy /> },
    ]
  }
];

export default function CompanyDocumentsModal({ isOpen, onClose }: IProps) {
  // Default to the first item (Terms and Conditions)
  const [activeTab, setActiveTab] = useState("terms");

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
                {cat.items.map((doc) => {
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
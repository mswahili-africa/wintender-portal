import React from "react";
import { IPEPerson } from "@/types";
import dummyLogo from "@/assets/images/bidder-dummy-logo.png";
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconBuilding, 
  IconBriefcase, 
  IconShield,
  IconCalendar,
  IconId
} from "@tabler/icons-react";
import Modal from "@/components/widgets/Modal";

interface PEPersonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: IPEPerson | null;
}

// Dummy Modal wrapper matching your exact props structure if your UI kit doesn't provide it
// If you already have a global <Modal> component, just use the inner content!
export const PEPersonDetailsModal: React.FC<PEPersonDetailsModalProps> = ({ isOpen, onClose, person }) => {
  if (!person) return null;

  // Format Unix timestamp helper
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Modal 
      size="md" 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Profile Details"
    >
      <div className="space-y-6 py-2">
        
        {/* --- Header Hero Section --- */}
        <div className="relative flex flex-col items-center text-center pb-6 border-b border-gray-100">
          <div className="relative group">
            <img
              src={person.passportPhoto || dummyLogo}
              alt={`${person.firstName} ${person.lastName}`}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-50 shadow-md"
            />
            <span className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border text-white shadow-sm ${
              person.gender === "MALE" ? "bg-blue-600 border-blue-400" : "bg-purple-600 border-purple-400"
            }`}>
              {person.gender}
            </span>
          </div>
          
          <h3 className="mt-3 text-lg font-semibold text-gray-900 capitalize">
            {person.firstName} {person.lastName}
          </h3>
          <p className="text-sm font-medium text-green-600 flex items-center gap-1 mt-0.5">
            <IconBriefcase size={14} />
            {person.jobTitle.trim()}
          </p>
        </div>

        {/* --- Contact Information Grid --- */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <IconUser size={14} />
            Contact Information
          </h4>
          <div className="bg-gray-50 rounded-xl p-3.5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-gray-400 border border-gray-100 shadow-sm">
                <IconMail size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Email Address</span>
                <a href={`mailto:${person.email}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors break-all">
                  {person.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-gray-400 border border-gray-100 shadow-sm">
                <IconPhone size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Phone Number</span>
                <span className="text-sm font-medium text-gray-800">{person.phoneNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-gray-400 border border-gray-100 shadow-sm">
                <IconMapPin size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Physical Address</span>
                <span className="text-sm font-medium text-gray-800 break-words">{person.address.trim()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Corporate / Entity Alignment --- */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <IconBuilding size={14} />
            Corporate &amp; Entity Node
          </h4>
          <div className="bg-gray-50 rounded-xl p-3.5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-gray-400 border border-gray-100 shadow-sm">
                  <IconBuilding size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Assigned Entity</span>
                  <span className="text-sm font-semibold text-gray-800">{person.entityName}</span>
                </div>
              </div>
              <span className="text-xs bg-purple-200 text-purple-700 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wide">
                {person.entityType}
              </span>
            </div>
          </div>
        </div>

        {/* --- System Registry Data --- */}
        {/* <div>
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <IconShield size={14} />
            System Metadata
          </h4>
          <div className="bg-gray-50 rounded-xl p-3.5 text-xs text-gray-600 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1"><IconId size={12} /> System ID</span>
              <span className="font-mono text-gray-700 select-all">{person.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1"><IconUser size={12} /> Creator Key</span>
              <span className="font-mono text-gray-500">{person.createdBy.substring(0, 10)}...</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200/60 pt-2.5">
              <span className="text-gray-400 flex items-center gap-1"><IconCalendar size={12} /> Registered On</span>
              <span className="font-medium text-gray-700">{formatDate(person.createdAt)}</span>
            </div>
          </div>
        </div> */}

      </div>
    </Modal>
  );
};
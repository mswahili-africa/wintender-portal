import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { 
  IconReportAnalytics, 
  IconCalendar, 
  IconBrandWhatsapp, 
  IconInfoCircle,
  IconArrowRight
} from '@tabler/icons-react';

import Button from '@/components/button/Button';
import Modal from '@/components/widgets/Modal';
import { requestApplicationPDFReport } from '@/services/tenders';
import { IApplicationPDFReport } from '@/types/forms';

interface IProps {
  open: boolean;
  groupId: string;
  onClose: () => void;
}

type ReportMode = 'SINGLE_MONTH' | 'DATE_RANGE';

export default function DifmReportGenerationModal({ open, groupId, onClose }: IProps) {
  const [reportMode, setReportMode] = useState<ReportMode>('SINGLE_MONTH');
  const [reportMonth, setReportMonth] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const requestPDFReportMutation = useMutation({
    mutationFn: (payload: IApplicationPDFReport) => requestApplicationPDFReport(payload),
    onSuccess: () => {
      toast.success("Check your WhatsApp for the PDF report");
      onClose();
    },
    onError: (data: any) => {
      console.log(data.response.data);
      toast.error("Report request failed. Please try again.");
    },
  });

  const handleFormSubmission = () => {
    // Structural Date Range Validation 
    if (reportMode === 'DATE_RANGE') {
      if (!startDate || !endDate) {
        toast.error("Please pick both start and end boundary periods");
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        toast.error("Start date cannot happen after the end date selection");
        return;
      }
    }

    // Compose parameters cleanly based on selected mode
    const currentYear = new Date().getFullYear();
    const computedPayload: IApplicationPDFReport = {
      groupId,
      month: reportMode === 'SINGLE_MONTH' ? reportMonth : "CUSTOM",
      ...(reportMode === 'DATE_RANGE' ? {
        startDate,
        endDate
      } : {
        // Fallback boundary computations for explicit months if your backend demands native range tags
        startDate: reportMonth === "ALL" ? undefined : `${currentYear}-${reportMonth.padStart(2, '0')}-01`,
        endDate: reportMonth === "ALL" ? undefined : `${currentYear}-${reportMonth.padStart(2, '0')}-31`, 
      })
    };

    requestPDFReportMutation.mutate(computedPayload);
  };

  return (
    <Modal
      size="md" // Upgraded size to give fields room to breathe
      title="DIFM Report Generation"
      isOpen={open}
      onClose={onClose}
    >
      <div className="space-y-6 pt-2">
        
        {/* Value Delivery Micro Notification Accent */}
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-emerald-800">
          <IconBrandWhatsapp size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold">Automated WhatsApp Delivery Enabled</p>
            <p className="text-emerald-700/90 font-medium">Your compiled analytical PDF document formats dynamically and shoots straight to your registered profile line hook.</p>
          </div>
        </div>

        {/* Dynamic Multi-Mode Segmented Control Tabs */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Select Scope Frame Mode
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => setReportMode('SINGLE_MONTH')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                reportMode === 'SINGLE_MONTH'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Specific Month
            </button>
            <button
              type="button"
              onClick={() => setReportMode('DATE_RANGE')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                reportMode === 'DATE_RANGE'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Custom Date Range
            </button>
          </div>
        </div>

        {/* Dynamic Segment Rendering Window Container */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 min-h-[100px] flex flex-col justify-center">
          {reportMode === 'SINGLE_MONTH' ? (
            /* Specific Month Section Dropdown Content */
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Choose Statement Target Month
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                >
                  <option value="ALL">All Available Logs (Full Timeline Summary)</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <IconCalendar size={16} />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium pl-1">
                Generates a report for the current year's month data logs.
              </p>
            </div>
          ) : (
            /* Advanced Range Input Form Component Elements Matrix */
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Define Custom Boundary Windows
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="relative w-full">
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wide border rounded border-slate-100">From</span>
                </div>

                <div className="text-slate-400 shrink-0 hidden sm:block">
                  <IconArrowRight size={16} />
                </div>

                <div className="relative w-full">
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wide border rounded border-slate-100">To</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Form Confirmation Footnotes */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            label={requestPDFReportMutation.isPending ? "Compiling Document..." : 'Compile & Dispatch PDF Report'}
            size="lg"
            theme="primary"
            icon={<IconReportAnalytics size={18} />}
            disabled={requestPDFReportMutation.isPending}
            loading={requestPDFReportMutation.isPending}
            onClick={handleFormSubmission}
            className="w-full justify-center text-sm font-bold tracking-wide py-3 rounded-xl shadow-md transition-all duration-150"
          />
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            <IconInfoCircle size={12} className="text-slate-300" />
            <span>Process runs asynchronously</span>
          </div>
        </div>

      </div>
    </Modal>
  );
}
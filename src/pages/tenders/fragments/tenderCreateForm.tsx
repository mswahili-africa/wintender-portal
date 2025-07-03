import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { TenderInformationForm } from "./TenderInformationForm";
import { PreliminaryQualificationForm } from "./PreliminaryQualificationForm";
import { ITenders } from "@/types";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";

interface IProps {
    onSuccess: () => void;
    initials?: ITenders;
}
export default function TenderUpload({ onSuccess, initials }: IProps) {
    const [open, setOpen] = useState<boolean>(false);

    // JCM START
    // JCM accordion controlls variables
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const steps = [
        "Tender Information",
        "Preliminary Qualification",
        "Technical Qualification",
        "Commercial Qualification",
        "Consent Form",
    ]

    // JCM handle active step
    const handleCompleteStep = (index: number) => {
        if (!completedSteps.includes(index)) setCompletedSteps([...completedSteps, index]);
        setActiveStep(index + 1);
    };
    //   JCM END




    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Tender"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            {/* JCM modal showing steps and manage active step during form creation */}
            <Modal
                size="xl"
                title="Upload New Tender"
                isOpen={open}
                onClose={(v) => setOpen(v)}
            >
                <div className="max-w-7xl h-[70vh] overflow-hidden mx-auto mt-10">
                    {/* progress bar */}
                    Application progress <br />
                    <ProgressBar completedSteps={completedSteps} steps={steps}/>

                        {/* Step Navigation Tabs */}
                        <div className="flex flex-nowrap sm:flex-nowrap gap-2 overflow-x-auto mb-6 ">
                            {steps.map((title, index) => {
                                const isActive = activeStep === index;
                                const isClickable = index === 0 || completedSteps.includes(index - 1);

                                return (
                                    <button
                                        key={title}
                                        onClick={() => {
                                            if (isClickable) setActiveStep(index);
                                        }}
                                        className={`flex-1 whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all ${isActive ? "bg-green-600 text-white" : isClickable ? "bg-green-100 text-gray-700 hover:bg-green-200" : "bg-gray-50 text-gray-400 cursor-not-allowed"}`}
                                    >
                                        {title}
                                    </button>
                                );
                            })}
                        </div>

                    <div className="max-w-6xl h-3/4 pb-10 overflow-y-auto mx-auto px-4">

                        {/* Active Step Content */}
                        <div className="bg-white p-6 rounded-md shadow">
                            {activeStep === 0 && <TenderInformationForm onNext={() => handleCompleteStep(activeStep)} />}
                            {activeStep === 1 && <PreliminaryQualificationForm onNext={() => handleCompleteStep(activeStep)} />}
                            {activeStep === 2 && <div onClick={() => handleCompleteStep(activeStep)} > {activeStep}  </div>}
                            {activeStep === 3 && <div onClick={() => handleCompleteStep(activeStep)} > {activeStep}  </div>}
                            {activeStep === 4 &&
                                <div>
                                    <div className="text-start">
                                        <input type="checkbox" className="mr-2" name="" id="" />
                                        I have read and agree to the Terms and Conditions
                                    </div>
                                    <div className="text-end">
                                        <Button
                                            size="md"
                                            theme="primary"
                                            label="Submit"
                                            type="button"
                                            onClick={() => { handleCompleteStep(activeStep); }}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    );
}

import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { IPlan } from "@/types/forms";
import { IconFileText } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { PreliminaryQualificationForm } from "./PreliminaryQualificationForm";
import { ProgressBar } from "../../../components/progress-bar/ProgressBar";

interface IProps {
    onSuccess: () => void;
    initials?: IPlan;
    isOpen: boolean;
    onClose: () => void;
    tenderId: string;
}



export default function BidderTenderApplicationFormModel({ onSuccess, isOpen, onClose, tenderId }: IProps) {

    // JCM START

    const [tenderFile, setTenderFile] = useState<string | any>();
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const steps = [
        "Proof of Payment",
        "Preliminary Qualification",
        "Technical Qualification",
        "Commercial Qualification",
        "Consent Form",
    ]
    const handleCompleteStep = (index: number) => {
        if (!completedSteps.includes(index)) setCompletedSteps([...completedSteps, index]);
        setActiveStep(index + 1);
    };
    // JCM END

    return (
        <Modal
            size="xl"
            title="Tender Application Form"
            isOpen={isOpen} onClose={onClose}
        >
            <div className="max-w-7xl h-[75vh] overflow-hidden  mx-auto mt-10">
                {/* progress bar */}
                Application progress <br />
                <ProgressBar completedSteps={completedSteps} steps={steps} />
                
                {/* Step Navigation Tabs */}
                <div className="flex flex-nowrap sm:flex-nowrap gap-2 overflow-x-auto mb-6">
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

                    {/* Active Step Content div*/}
                    <div className="bg-white pb-6 rounded-md shadow">
                        {activeStep === 0 &&
                            <div className="text-center">
                                <div className="text-start">
                                    Upload proof of payment <br />
                                </div>
                                <label htmlFor="tenderFile" className="cursor-pointer">
                                    <div className="text-slate-500 text-xs text-center font-light mb-2 border-2 border-green-600">
                                        <IconFileText
                                            size={32}
                                            strokeWidth={1.5}
                                            className="mx-auto mb-4"
                                        />
                                        {tenderFile ? (
                                            <div>{tenderFile}</div>
                                        ) : (
                                            <Fragment>
                                                <p>Add your proof of payment file here</p>
                                                <p className="text-blue-500 font-medium">Click to browse</p>
                                            </Fragment>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="tenderFile"
                                        accept=".pdf"
                                        className="hidden"
                                    />
                                </label>
                                <Button size="md" label="Upload" theme="primary" type="button" onClick={() => handleCompleteStep(activeStep)} />
                            </div>
                        }
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
        </Modal>
    );
}

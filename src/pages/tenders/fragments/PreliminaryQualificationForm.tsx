import Button from "@/components/button/Button";
import { useUserDataContext } from "@/providers/userDataProvider";
import { IconFileText } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { register } from "module";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

// JCM PreliminaryQualificationForm
const preliminaryQualifications = [
    "Tax Identification Number",
    "VAT (If applicable)",
    "Business License",
    "Certificate of Incorporation",
    "Tax Clearance",
    "ISO",
    "NSSF",
    "WCF",
    "Regulatory Certificate (e.g TMDA, TFDA, LATRA, CRB, TIVEA etc.)",
];

export function PreliminaryQualificationForm({ onNext }: { onNext: () => void }) {
    const [selected, setSelected] = useState<string[]>([]);
    const { userData } = useUserDataContext();

    const [tenderFile, setTenderFile] = useState<string | any>();

    const addItem = (item: string) => {
        if (!selected.includes(item)) {
            setSelected([...selected, item]);
        }
    };

    const removeItem = (item: string) => {
        setSelected(selected.filter((i) => i !== item));
    };


    // JCM handle submit
    const handleSubmit = () => {
        if (selected.length === 0) {
            toast.error("Please select at least one prelimary qualification.");
            return;
        }
        // JCM Submit logic 
        onNext();
    };

    const available = preliminaryQualifications.filter((item) => !selected.includes(item));

    return (
        <div>

            {/* PUBLISHER, MANAGER AND ADMINISTRATOR */}
            {
                ["PUBLISHER", "MANAGER", "ADMINISTRATOR"].includes(userData?.role ?? "") && <>
                    <h3 className="font-semibold mb-3">Select Required Documents</h3>
                    {/* Selected Items */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected</h4>
                        <div className="flex flex-wrap gap-2">
                            {selected.map((item) => (
                                <div
                                    key={item}
                                    className="bg-green-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                    {item}
                                    <button
                                        onClick={() => removeItem(item)}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {selected.length === 0 && (
                                <p className="text-gray-400 text-sm">No items selected yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Available Items */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available</h4>
                        <div className="flex flex-wrap gap-2">
                            {available.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => addItem(item)}
                                    className="border border-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-100"
                                >
                                    + {item}
                                </button>
                            ))}
                            {available.length === 0 && (
                                <p className="text-gray-400 text-sm">All items selected.</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full text-center">
                        <Button
                            type="submit"
                            label="Save"
                            theme="primary"
                            size="md"
                            onClick={() => handleSubmit()}
                        />
                    </div>
                </>
            }


            {/* BIDDER FORM */}
            {
                userData?.role === "BIDDER" && <>
                    <div className="w-full text-center space-y-2">
                        
                        {
                            selected.map((step, index) => (
                                <div key={index}>
                                    <p className="font-semibold mb-2 text-start mt-3">{step}</p>
                                    <label
                                        htmlFor="tenderFile"
                                        className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md cursor-pointer"
                                    >
                                        <div className="text-slate-500 text-xs text-center font-light">
                                            <IconFileText
                                                size={32}
                                                strokeWidth={1.5}
                                                className="mx-auto mb-4"
                                            />
                                            {tenderFile ? (
                                                <div>{tenderFile}</div>
                                            ) : (
                                                <Fragment>
                                                    <p>Add your {step} file here</p>
                                                    <p className="text-blue-500 font-medium">Click to browse</p>
                                                </Fragment>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            id="tenderFile"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={(e) => setTenderFile(e.target.files?.[0]?.name)}
                                        />
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </>
            }

        </div>
    );
}

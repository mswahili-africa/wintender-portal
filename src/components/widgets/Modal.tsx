import { Dialog, Transition } from "@headlessui/react";
import { IconX } from "@tabler/icons-react";
import { Fragment, ReactNode } from "react";

type TProps = {
    isOpen: boolean
    size: "xs" | "sm" | "md" | "lg" | "xl"
    title: string
    children: ReactNode
    onClose: (value: boolean) => void
}


export default function({...props}: TProps) {

    const computedSize = () => {
        switch(props.size) {
            case "xs":
                return "w-full md:max-w-xs xl:max-w-sm"
            case "sm":
                return "w-full md:max-w-md xl:max-w-lg"
            case "md":
                return "w-full md:max-w-xl xl:max-w-2xl"
            case "lg":
                return "w-full md:max-w-2xl xl:max-w-3xl"
            case "xl":
                return "w-full max-w-3xl xl:max-w-5xl"
            default:
                return "w-full max-w-md"
        }
    }

    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => props.onClose(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            
                            <Dialog.Panel className={`transform rounded-md bg-white text-left align-middle shadow-xl transition-all ${computedSize()}`}>
                                <div className="relative py-2 px-4 md:py-4 md:px-8 mb-8 rounded-t-md">
                                    <button 
                                        className="absolute -right-2 -top-2 p-1 bg-white text-zinc-800 rounded-md shadow" 
                                        onClick={() => {
                                            props.onClose(false)
                                        }}>
                                        <IconX size={20} />
                                    </button>
                            
                                    <div className="border-b border-slate-200 pb-3 mb-6">
                                        <div>{props.title}</div>
                                    </div>
                                    {props.children}
                                </div>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
                
            </Dialog>
        </Transition>
    )
}
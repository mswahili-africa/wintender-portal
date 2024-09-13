import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";



interface IProps {
    isOpen: boolean
    theme: "info" | "success" | "danger" | "warning"
    title: string
    message: string,
    acceptText?: string
    declineText?: string
    onAccept: () => void
    onDecline: () => void
    onClose: (value: boolean) => void
}


export default function({...props}: IProps) {

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
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-300"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            
                            <Dialog.Panel className="w-full md:max-w-xs xl:max-w-md transform rounded-md overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                                <div className="relative">
                                    <div className="p-4 md:px-8 text-black">
                                        <h4 className="text-sm md:text-base font-semibold mb-2">{props.title}</h4>
                                        <p className="text-xs md:text-sm">{props.message}</p>
                                    </div>
                                    
                                    <div className="flex justify-between md:justify-end items-center md:space-x-2 md:py-4 md:px-8 bg-zinc-50 text-xs">
                                        <button 
                                            className="text-xs md:text-sm text-white font-medium bg-red-500 px-4 py-3 md:py-2 w-full md:max-w-max md:rounded-md" 
                                            onClick={() => props.onDecline()}>
                                            {props.declineText ?? "Cancel"}
                                        </button>
                                        <button 
                                            className="text-xs md:text-sm text-white font-medium bg-green-600 px-4 py-3 md:py-2 w-full md:max-w-max md:rounded-md"
                                            onClick={() => props.onAccept()} >
                                            {props.acceptText ?? "Sure"}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
                
            </Dialog>
        </Transition>
    )
}
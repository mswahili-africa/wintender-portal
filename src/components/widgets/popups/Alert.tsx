import { Dialog, Transition } from "@headlessui/react";
import { IconAlertHexagon, IconAward, IconBulb, IconSquareRoundedMinus, IconX } from "@tabler/icons-react";
import { Fragment, ReactNode } from "react";



interface IProps {
    isOpen: boolean
    theme: "info" | "success" | "danger" | "warning"
    title: string
    message: string,
    children?: ReactNode
    onClose: (value: boolean) => void
}


export default function({...props}: IProps) {

    const computedCloseIconTheme = () => {
        switch(props.theme) {
            case "info":
                return "text-white bg-green-600"
            case "success":
                return "text-white bg-emerald-600"
            case "warning":
                return "text-white bg-yellow-500"
            default:
                return "text-white bg-red-500"
        }
    }

    const computedIconTheme = () => {
        switch(props.theme) {
            case "info":
                return <IconBulb size={40} strokeWidth={1.5} className="text-green-600" />
            case "success":
                return <IconAward size={40} strokeWidth={1.5} className="text-emerald-600" />
            case "warning":
                return <IconAlertHexagon size={40} strokeWidth={1.5} className="text-yellow-500" />
            default:
                return <IconSquareRoundedMinus size={40} strokeWidth={1.5} className="text-red-500" />
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
                            
                            <Dialog.Panel className="w-full md:max-w-xs xl:max-w-md transform rounded-md bg-white text-left align-middle shadow-xl transition-all">
                                <div className="relative">
                                    {
                                        props.children == undefined &&

                                        <button 
                                            className={`absolute -right-2 -top-2 p-1 bg-green-600 text-white rounded-md shadow-sm focus:ring-0 focus:outline-none ${computedCloseIconTheme()}`} 
                                            onClick={() => props.onClose(false)}>
                                            <IconX size={20} />
                                        </button>
                                    }
                                    
                                    <div className="flex items-center py-4 px-4 md:px-8">
                                        <div className="grow">
                                            {computedIconTheme()}
                                        </div>

                                        <div className="w-4/5 ml-4 text-black">
                                            <h4 className="text-sm md:text-base font-semibold mb-2">{props.title}</h4>
                                            <p className="text-xs md:text-sm">{props.message}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end items-center space-x-2 p-4 md:px-8 bg-zinc-50 text-xs rounded-b-md">
                                        {props.children}
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
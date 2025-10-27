import { Dialog, Transition } from "@headlessui/react";
import { IconX } from "@tabler/icons-react";
import { Fragment } from "react";
import { cva } from "class-variance-authority";



interface IProps {
    isOpen: boolean
    size: "xs" | "sm" | "md" | "lg" | "xl"
    children: React.ReactNode
    closeIcon?: boolean
    zIndex?: number
    onClose: (value: boolean | any) => void
}


export default function(props: IProps) {

    const modalClass = () => {
        const defaultClass = "transform rounded bg-white text-left align-middle shadow-xl transition-all overflow-y-auto";

        const config = {
            variants: {
                size: {
                    xs: "w-full md:max-w-xs xl:max-w-sm",
                    sm: "w-full md:max-w-md xl:max-w-lg",
                    md: "w-full md:max-w-xl xl:max-w-2xl",
                    lg: "w-full md:max-w-2xl xl:max-w-3xl",
                    xl: "w-full max-w-3xl xl:max-w-5xl"
                }
            }
        }

        return cva(defaultClass, config)({
            size: props.size ?? "sm"
        })
    }

    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog as="div" static className={`relative z-${props.zIndex ?? 40}`} onClose={() => props.onClose(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/10" />
                </Transition.Child>

                <div className="fixed inset-0 bg-zinc-800/60 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            
                            <Dialog.Panel className={modalClass}>
                                <div className="relative">
                                    {
                                        props.closeIcon &&
                                        <button 
                                            className="absolute right-2 top-2 p-1 bg-white hover:bg-primary text-zinc-800 hover:text-gray-400 rounded-md shadow-xl" 
                                            onClick={() => props.onClose(false)}>
                                            <IconX size={20} />
                                        </button>
                                    }
                                    
                                    <div className="py-2 px-4 md:py-6 md:px-8 rounded-b-md">
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
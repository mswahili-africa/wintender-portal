import { Tab } from "@headlessui/react";
import React from "react";

interface IProps {
    panels: String[];
    children: React.ReactNode;
}


export default function({...props}: IProps) {

    return (
        <Tab.Group>
            <Tab.List className="flex rounded-2xl border border-slate-200 shadow-sm max-w-max p-1">
                {
                    props.panels.map((item, index) =>
                        <Tab 
                            as="div" 
                            key={index}
                            className={ ({selected}) => {
                                return `cursor-pointer focus:outline-none text-sm font-medium px-6 py-2 rounded-xl ${selected ? 'text-white bg-green-600' : 'text-slate-400 border-slate-200'}`
                            }}>
                            {item}
                        </Tab>
                    )
                }
                
            </Tab.List>
            <Tab.Panels className="mt-10">
                {
                    React.Children.map(props.children, (child, index) => (
                        <Tab.Panel key={index}>{child}</Tab.Panel>
                    ))
                }
            </Tab.Panels>
        </Tab.Group>
    )
}
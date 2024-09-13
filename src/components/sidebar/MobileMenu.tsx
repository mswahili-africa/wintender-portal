import SlideOver from "@/components/widgets/SlideOver";
import { IconMenu2 } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import SidebarLinks from "./fragments/SidebarLinks";



export default function() {
    const [open, setOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSidebar = () => {
        setOpen(!open);
    };


    return (
        <div>
            <button
                data-drawer-target="default-sidebar"
                data-drawer-toggle="default-sidebar"
                aria-controls="default-sidebar"
                className="block lg:hidden p-2 text-slate-600 rounded-lg"
                onClick={toggleSidebar}>
                <IconMenu2 size="20" strokeWidth={1.5} />
            </button>

            <SlideOver open={open}>
                <aside
                    ref={sidebarRef}
                    id="default-sidebar"
                    className="absolute inset-y-0 overflow-y-auto w-64 bg-slate-50 border-r border-r-slate-200"
                    aria-label="Sidebar"
                >
                    <div className="px-3 py-4">
                        <SidebarLinks/>
                    </div>
                </aside>
            </SlideOver>
        </div>
    )
}
import SidebarLinks from "./fragments/SidebarLinks";



export default function() {

    return (
        <aside className="relative hidden lg:block h-screen overflow-y-auto">
            <div className="absolute inset-0 p-4 pl-6 bg-slate-50 border-r border-r-slate-200">
                <SidebarLinks/>
            </div>
        </aside>
    );
}

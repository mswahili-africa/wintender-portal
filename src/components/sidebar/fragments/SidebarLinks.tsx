import { routes } from "@/routes";
import { Link, useLocation } from "react-router-dom";

export default function() {
    const location = useLocation();

    return (
        <div className="text-xs md:text-sm text-slate-600 font-medium">
            {
                routes.map((item, index) => 
                    <div key={index}>

                        {
                            item.subMenu && item.subMenu.length > 0 ?

                            <div className="mt-4 mb-4">
                                <div className="text-slate-800 text-xs font-medium uppercase mb-2">{item.label}</div>
                                {
                                    item.subMenu.map((subItem, subIndex) => 
                                        <Link to={subItem.path} key={subIndex}>
                                            <div className={`flex items-center px-4 py-3 rounded-md ${location.pathname === subItem.path ? 'bg-green-600 text-white' : 'hover:bg-slate-100'}`}>
                                                <div className="pr-3">{subItem.icon}</div>
                                                <span>{subItem.label}</span>
                                            </div>
                                        </Link>
                                    )
                                }
                            </div>:

                            <Link to={item.path} className="mb-4">
                                <div className={`flex items-center px-4 py-3 rounded-md ${location.pathname === item.path ? 'bg-green-600 text-white' : 'hover:bg-slate-100'}`}>
                                    <div className="pr-2">{item.icon}</div>
                                    
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        }

                    </div>
                )
            }
        </div>
    );
}

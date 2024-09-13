import { IconArrowUpRight, IconDotsVertical } from "@tabler/icons-react";
import { ReactElement } from "react";

interface IProps {
    icon: ReactElement;
    valuespercent: string | number;
    color:any;
    valueString: string | number;
    valueNumber:number;
    values:string
};

const Maincard = ({ icon, valuespercent,color,valueString,valueNumber,values }: IProps) => {

    return (
        <div className="flex flex-col gap-5 border-[1px] border-slate-200 bg-slate-50 p-5 rounded-lg lg:mt-10">
            <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center space-x-2">
                    <span className={`${color} w-10 h-10 rounded-md flex justify-center items-center`}>
                        {icon}
                    </span>
                    <span className="font-semibold text-slate-600">
                        {valueString}
                    </span>
                </div>
                <div>
                    <span className="cursor-pointer">
                        <IconDotsVertical />
                    </span>
                </div>
            </div>
            <div>
                <div className="flex border border-slate-200 bg-slate-100 rounded-lg justify-between p-5">
                    <div>{values}</div>
                    <div className="flex flex-col items-center">
                        <p>{valueNumber}</p>
                        <span className="flex text-green-600 items-center">
                            <span>
                                <IconArrowUpRight className="w-5" />
                            </span>
                            <span>{valuespercent}{"%"}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Maincard;

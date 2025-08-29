import { useEffect, useState } from "react";

type TProps = {
    expirationTime: number
}
export const Countdown = ({ expirationTime }: TProps) => {
    const [time, setTime] = useState<number>(expirationTime - Date.now());

    // count down from current time to expiration time
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-row items-center gap-x-4 font-bold text-gray-800">
            {/* Days */}
            <div className={`text-lg py-1 ${Math.floor(time / (1000 * 60 * 60 * 24)) <= 1 ? "bg-red-500" : "bg-green-500"}  text-white px-2 rounded`}>
                {Math.floor(time / (1000 * 60 * 60 * 24))}{" "}
                <span className="font-medium text-xs">day(s)</span>
            </div>

            {/* Countdown */}
            <div className="flex flex-row items-center gap-x-2 text-base">
                <span className={`px-2 py-1 rounded text-white ${Math.floor((time / (1000 * 60 * 60)) % 24) <= 1 ? "bg-red-500" : "bg-green-500"}`}>
                    {Math.floor((time / (1000 * 60 * 60)) % 24)}
                    <span className="font-medium text-xs "> h</span>
                </span>
                <span className="px-2 py-1 rounded bg-green-500 text-white">
                    {Math.floor((time / (1000 * 60)) % 60)}
                    <span className="font-medium text-xs"> m</span>
                </span>
                <span className="px-2 py-1 rounded bg-green-500 text-white">
                    {Math.floor((time / 1000) % 60)}
                    <span className="font-medium text-xs"> s</span>
                </span>
            </div>
        </div>


    )
}

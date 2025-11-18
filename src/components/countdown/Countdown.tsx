import { useEffect, useState } from "react";

type TProps = {
  expirationTime: number;
};

export const Countdown = ({ expirationTime }: TProps) => {
  const [time, setTime] = useState<number>(expirationTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const seconds = Math.floor((time / 1000) % 60);

  return (
    <div
      className={`flex items-center gap-4 px-4 py-1 rounded-lg shadow-lg backdrop-blur-md 
      ${
        days <= 1
          ? "bg-red-500/80 text-white"
          : "bg-green-500/80 text-white"
      }`}
    >
      {/* Days */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-extrabold">{days > 0 ? days : 0}</span>
        <span className="text-[6pt] uppercase tracking-wide">Days</span>
      </div>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-extrabold">{hours>0 ? hours : 0}</span>
        <span className="text-[6pt] uppercase tracking-wide">Hrs</span>
      </div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-extrabold">{minutes>0 ? minutes : 0}</span>
        <span className="text-[6pt] uppercase tracking-wide">Mins</span>
      </div>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-extrabold">{seconds>0 ? seconds : 0}</span>
        <span className="text-[6pt] uppercase tracking-wide">Secs</span>
      </div>
    </div>
  );
};

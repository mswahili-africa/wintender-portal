import {
  IconCircleCheck,
  IconCircleX,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";

type StatusType = "up" | "down" | "warning" | "info";

interface StatusIconProps {
  status: StatusType;
  size?: number;
}

const statusConfig: Record<
  StatusType,
  { color: string; bg: string; icon: React.ElementType }
> = {
  up: {
    color: "text-green-600",
    bg: "bg-green-300",
    icon: IconCircleCheck,
  },
  down: {
    color: "text-red-600",
    bg: "bg-red-400",
    icon: IconCircleX,
  },
  warning: {
    color: "text-yellow-600",
    bg: "bg-yellow-300",
    icon: IconAlertTriangle,
  },
  info: {
    color: "text-blue-600",
    bg: "bg-blue-300",
    icon: IconInfoCircle,
  },
};

export function StatusIconFlag({ status, size = 28 }: StatusIconProps) {
  const { color, bg, icon: Icon } = statusConfig[status];

  return (
    <div className="relative h-16 w-16 flex items-center justify-center">
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${bg} opacity-75 ${status === "down" || status === "warning" ? "animate-ping" : ""}`}
      ></span>

      <span className="relative flex items-center justify-center h-16 w-16 rounded-full bg-white shadow">
        <Icon className={color} size={size} />
      </span>
    </div>
  );
}

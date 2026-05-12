import { IRating } from "@/types";
import { RatingReason } from "@/types/forms";
import { IconInfoCircle, IconStar, IconStarFilled } from "@tabler/icons-react";

export const RatingDisplay = ({ rating, showReason }: { rating: IRating | null, showReason?: boolean }) => {
  // if (!rating) return <span className="text-xs text-gray-400 italic">No rating yet</span>;
  if (!rating) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="transition-transform hover:scale-110">
            {star <= 1 ? (
              <IconStarFilled className="w-4 h-4 text-amber-400 drop-shadow-sm" />
            ) : (
              <IconStar className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
        <span className="ml-2 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
          1.0
        </span>
      </div>
    );
  }



  return (
    <div className="flex flex-col gap-1">
      {/* Star Row */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="transition-transform hover:scale-110">
            {star <= rating.star ? (
              <IconStarFilled className="w-4 h-4 text-amber-400 drop-shadow-sm" />
            ) : (
              <IconStar className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
        <span className="ml-2 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
          {rating.star}.0
        </span>
      </div>

      {/* Reason Badge */}
      {
        showReason && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md">
              <IconInfoCircle size={14} className="text-blue-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                {Object.entries(RatingReason).find(([key, value]) => key === rating.reason)?.[1] || rating.reason}
              </span>
            </div>
          </div>
        )
      }
    </div>
  );
};
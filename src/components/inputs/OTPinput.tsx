import React, { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(() => {
    const initialArr = value.split("").slice(0, length);
    return Array.from({ length }, (_, i) => initialArr[i] || "");
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync internal state with external value changes
  useEffect(() => {
    const normalized = value.slice(0, length).split("");
    const newOtp = Array.from({ length }, (_, i) => normalized[i] || "");
    setOtp(newOtp);
  }, [value, length]);

  // Handle initial auto-focus
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const updateOtpState = (newOtp: string[]) => {
    setOtp(newOtp);
    const combined = newOtp.join("");
    onChange(combined);
    if (combined.length === length && onComplete) {
      onComplete(combined);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // Restrict to numeric digits
    if (!val) return;

    const newOtp = [...otp];
    // Take only the last entered character if multiple are present
    newOtp[index] = val.slice(-1);
    updateOtpState(newOtp);

    // Auto-focus next input slot
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle Backspace navigation
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current value if present
        newOtp[index] = "";
        updateOtpState(newOtp);
      } else if (index > 0) {
        // Move to previous box and clear it
        newOtp[index - 1] = "";
        updateOtpState(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Arrow Key Navigation
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/[^0-9]/g, "")
      .slice(0, length);

    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });

    updateOtpState(newOtp);

    // Focus the box following the last pasted character
    const targetFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetFocusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {otp.map((digit, index) => {
        const isFilled = Boolean(digit);

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()} // Auto-select on click/focus for fast overwrites
            className={`
              w-10 h-12 sm:w-12 sm:h-14 
              text-center text-lg sm:text-xl font-bold font-mono
              rounded-xl border transition-all duration-150 outline-none
              disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60
              ${
                isFilled
                  ? "border-emerald-500 bg-emerald-50/30 text-slate-900 shadow-sm"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
              }
              focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white
            `}
            aria-label={`Digit ${index + 1} of ${length}`}
          />
        );
      })}
    </div>
  );
};
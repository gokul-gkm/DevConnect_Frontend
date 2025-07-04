"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function OTPVerification() {
  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(120); 
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);


    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").substring(0, 5);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 5; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 4)]?.focus();
  };

  const handleResend = () => {
    setTimeLeft(120); 
    setOtp(Array(5).fill("")); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md p-8 rounded-lg border border-blue-500 relative">

        <div className="absolute inset-0 rounded-lg blur-[2px] bg-blue-500/20 -z-10" />
        

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-800">
            <span className="text-white font-medium text-xl">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <p className="text-gray-400 text-center mb-8">
          Enter the OTP sent to your email
        </p>

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              className={cn(
                "w-12 h-14 text-center text-white text-xl font-semibold",
                "bg-gray-900 rounded-md border border-gray-800",
                "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                "transition-all duration-200"
              )}
            />
          ))}
        </div>

        <button
          className={cn(
            "w-full py-3 rounded-md text-white font-medium",
            "bg-gray-900 hover:bg-gray-800",
            "transition-colors duration-200",
            "mb-4"
          )}
        >
          Verify OTP
        </button>

        <button
          onClick={handleResend}
          disabled={timeLeft > 0}
          className={cn(
            "w-full text-center text-sm",
            timeLeft > 0
              ? "text-gray-600 cursor-not-allowed"
              : "text-blue-500 hover:text-blue-400"
          )}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}


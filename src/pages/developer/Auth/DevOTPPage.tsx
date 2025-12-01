import { BottomGradient } from "@/components/ui/BottomGradient";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDevOTP } from "@/hooks/devAuth/useDevOtp";
import { Loader2 } from "lucide-react";

const DEV_OTP_EXPIRES_KEY = "dev_otp_expires_at";
const OTP_TIMER_DURATION = 60;

const DevOTPPage: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || { email: "" };
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(OTP_TIMER_DURATION);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const { verifyOtp, isVerifying, resendOtp, isResending } = useDevOTP();

  useEffect(() => {
    if (!email) {
      toast.error("No email provided");
      navigate("/developer/auth/register");
      return;
    }

    const storedExpires = localStorage.getItem(DEV_OTP_EXPIRES_KEY);
    const now = Date.now();

    if (storedExpires) {
      const expiresAt = new Date(storedExpires).getTime();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(remaining);
    } else {
      setTimeLeft(0);
    }

  
  }, [email, navigate]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
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

  useEffect(() => {
    if (timeLeft) {
      const timerId = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      localStorage.removeItem(DEV_OTP_EXPIRES_KEY);
    }
  }, [timeLeft])
  

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    verifyOtp({ email, otp: otpString });
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    setOtp(["", "", "", "", "", ""]);

    try {
      const data = await resendOtp(email);
      if (data?.expiresAt) {
        const expiresAt = new Date(data.expiresAt).getTime();
        localStorage.setItem(DEV_OTP_EXPIRES_KEY, data.expiresAt);
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
      } else {
        setTimeLeft(OTP_TIMER_DURATION);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[320px] bg-black rounded-2xl p-4 sm:p-6 relative shadow-[0_5px_30px_rgba(255,_255,_255,_0.2)]">
        <div className="absolute inset-0 rounded-2xl bg-black"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
          <span className={`text-base font-medium ${timeLeft === 0 ? 'text-gray-500' : 'text-black'}`}>
  {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
</span>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
            Enter the OTP sent to your email
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-8 h-10 sm:w-9 sm:h-12 bg-[#1A1A1A] text-white text-lg sm:text-xl 
                           text-center rounded-xl border border-gray-800 
                           focus:border-[#0066ff] focus:outline-none transition-all 
                           duration-200 shadow-sm"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-xl h-9 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify OTP →"
              )}
              
              <BottomGradient />
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || timeLeft > 0}
              className="w-full text-[#0066ff] py-2 text-xs sm:text-sm rounded-xl 
                       hover:text-[#4d94ff] transition-colors duration-200 
                       disabled:text-gray-600 flex justify-center items-center"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Resending...
                </>
              ) : (
                "Resend OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DevOTPPage;
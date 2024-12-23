import { BottomGradient } from '@/components/ui/BottomGradient';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const UserOTPPage: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || { email: "" };
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(105);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSuccess('OTP verified successfully!');
      setErrors('');
      navigate('/auth/login');
    } catch (error: any) {
      setErrors(error.response?.data.message);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      setTimeLeft(105);
      setSuccess('New OTP sent successfully!');
      setErrors('');
    } catch (error: any) {
      setErrors(error.response?.data.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-[320px] bg-black rounded-2xl p-4 sm:p-6 relative shadow-[0_5px_30px_rgba(255,_255,_255,_0.2)]">
        <div className="absolute inset-0 rounded-2xl bg-black"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Timer Display */}
          <div className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
            <span className="text-black text-base sm:text-lg font-medium">{formatTime(timeLeft)}</span>
          </div>

          {/* Instructions */}
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
            Enter the OTP sent to your email
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            {/* OTP Input Container */}
            <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-8 h-10 sm:w-9 sm:h-12 bg-[#1A1A1A] text-white text-lg sm:text-xl 
                           text-center rounded-md border border-gray-800 
                           focus:border-[#0066ff] focus:outline-none transition-all 
                           duration-200 shadow-sm"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errors && 
              <p className="text-red-500 text-center text-xs sm:text-sm mb-3">{errors}</p>
            }
            {success && 
              <p className="text-green-500 text-center text-xs sm:text-sm mb-3">{success}</p>
            }

            {/* Verify Button */}
            

                      <button type="submit"
                                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-9 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                              >
                                Verify OTP &rarr;
                                <BottomGradient />
                              </button>
                      

            {/* Resend Button */}
            <button 
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || timeLeft > 0}
              className="w-full text-[#0066ff] py-2 text-xs sm:text-sm rounded-md 
                       hover:text-[#4d94ff] transition-colors duration-200 
                       disabled:text-gray-600"
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
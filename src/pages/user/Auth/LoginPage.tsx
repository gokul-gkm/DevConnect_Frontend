"use client";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Link } from "react-router-dom";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/utils/validation/userValidation";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "@/hooks/userAuth/useLogin";
import { useGoogleLogin } from "@/hooks/userAuth/useGoogleLogin";
import { Loader2 } from "lucide-react";
import {motion} from 'framer-motion'

export default function UserLoginPage() {
  const { login, isLogging } = useLogin();
  const { handleGoogleSuccess, handleGoogleError } = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12 bg-black min-h-full">
          <div className="w-full max-w-sm">
            <div className="mb-6 space-y-2">
              <h1 className="text-3xl md:text-3xl font-bold text-white">Log in to your account</h1>
              <p className="text-sm text-gray-400">Welcome back! Please enter your details.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="example@gmail.com"
                  type="email"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-xl h-10 text-sm"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-0.5 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-xl h-10 text-sm"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-xs text-red-500 mt-0.5 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="text-end">
                <Link to="/auth/forgot-password">
                  <span className="text-blue-600 text-xs hover:underline">
                    Forgot password?
                  </span>
                </Link>
              </div>

              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLogging}
              >
                {isLogging ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In →"
                )}
                <BottomGradient />
              </button>

              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-3 h-[1px] w-full" />

              <div className="flex gap-2 justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  text="signup_with"
                  logo_alignment="left"
                  shape="rectangular"
                  theme="filled_black"
                />
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-400 text-xs">
                Don't have an account?{" "}
                <Link to="/auth/register">
                  <span className="text-blue-600 hover:underline">Sign Up</span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        

        <div
          className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-black relative overflow-hidden"
        
        >
          <motion.div
            className="relative z-10 flex items-center justify-center "
            initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
          >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-100 z-10 h-full pointer-events-none"></div>
            <img
              src="/devLog.png"
              alt="DevConnect Community"
              width={450}
              height={450}
              className="rounded-2xl object-cover shadow-2xl"
            />
          </motion.div>

          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
        </div>

      </div>
    </div>
  );
}

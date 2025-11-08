"use client";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Link } from "react-router-dom";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/utils/validation/userValidation";
import { IRegisterData } from "@/types/types";
import { GoogleLogin } from '@react-oauth/google';
import { useRegister } from "@/hooks/userAuth/useRegister";
import { useGoogleLogin } from "@/hooks/userAuth/useGoogleLogin";
import { Loader2 } from "lucide-react";

export default function UserRegisterPage() {
  const { register: registerUser, isRegistering } = useRegister();
  const { handleGoogleSuccess, handleGoogleError } = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: IRegisterData) => {
    registerUser(data);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-black -mt-20">
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-black relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-100 z-10 h-full pointer-events-none"></div>
            <img
              src="/devAvatar.png"
              alt="DevConnect Community"
              width={450}
              height={450}
              className="rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12 bg-black min-h-[calc(100vh-5rem)]">
          <div className="w-full max-w-sm py-8">
            <div className="mb-4 mt-2 space-y-2">
              <h1 className="text-3xl md:text-3xl font-bold text-white">Create an account</h1>
              <p className="text-sm text-gray-400">Join us! Please fill in your details to get started.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-medium text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-xl h-10 text-sm"
                    {...register("username")}
                  />
                  {errors.username && (
                    <span className="text-xs text-red-500 mt-0.5 block">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact" className="text-xs font-medium text-white">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    placeholder="9876-543-210"
                    type="tel"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-xl h-10 text-sm"
                    {...register("contact")}
                  />
                  {errors.contact && (
                    <span className="text-xs text-red-500 mt-0.5 block">
                      {errors.contact.message}
                    </span>
                  )}
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirmpassword" className="text-xs font-medium text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmpassword"
                    placeholder="••••••••"
                    type="password"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-xl h-10 text-sm"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-500 mt-0.5 block">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing up...
                  </>
                ) : (
                  "Sign up →"
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
                Already have an account?{" "}
                <Link to="/auth/login">
                  <span className="text-blue-600 hover:underline">Sign In</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"

import { Input } from "@/components/ui/Input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/utils/validation/userValidation";
import { useAdminLogin } from "@/hooks/admin/useAdminLogin";
import { Loader2 } from "lucide-react";
import { BottomGradient } from "@/components/ui/BottomGradient";

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { login, isLoading } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginData) => {
    login({ email: data.email, password: data.password });
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-slate-950 relative overflow-hidden">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 opacity-70"></div> */}
          <div className="relative z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 opacity-100 z-10 h-full pointer-events-none"></div>
            <img
              src="/devAvatar.png"
              alt="DevConnect Community"
              width={450}
              height={450}
              className="rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12 bg-slate-950 min-h-full">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-3">
              <h1 className="text-4xl md:text-4xl font-bold text-white">Welcome Back Admin</h1>
              <p className="text-base text-gray-400">Please sign in to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white block">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all rounded-xl h-12"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white block">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all h-12 rounded-xl"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-xl h-12 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In →"
                )}
                <BottomGradient />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

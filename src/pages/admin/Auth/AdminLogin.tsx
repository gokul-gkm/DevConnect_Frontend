"use client";
import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/utils/validation/userValidation";
import { useAdminLogin } from "@/hooks/admin/useAdminLogin"; 
import { Loader2 } from "lucide-react";

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
    <div className="h-screen flex items-center">
      <div className="max-w-sm w-full mx-auto rounded-none md:rounded-xl p-4 py-4 md:p-8 bg-white dark:bg-black mb-6 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
        <div className="text-center">
          <h2 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">
            Welcome Back Admin
          </h2>
          <p className="text-neutral-600 text-xs max-w-xs mt-2 dark:text-neutral-300">
            Enter your email and password to sign in
          </p>
        </div>

        <form className="my-3" onSubmit={handleSubmit(onSubmit)}>
          <LabelInputContainer className="mb-3">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message}</span>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </LabelInputContainer>

          <button
  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-md h-9 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
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


          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
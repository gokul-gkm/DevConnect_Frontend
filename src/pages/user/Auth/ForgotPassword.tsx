"use client";
import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import * as z from "zod";
import AuthApi from "@/service/Api/AuthApi";
import { forgotPasswordSchema } from "@/utils/validation/userValidation";

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export function UserForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const response = await AuthApi.forgotPassword(data.email)
      toast.success("Password reset link has been sent to your email");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message ||"Failed to send password reset link. Please try again.");
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto rounded-none md:rounded-xl px-4 py-4 md:p-8 bg-white dark:bg-black mb-20 mt-24 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
      <div className="text-center">
        <h2 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">
          Reset password
        </h2>
        <p className="text-neutral-600 text-xs max-w-xs mt-2 dark:text-neutral-300">
          Enter your email address to receive a one-time password (OTP) and reset your password.
        </p>
      </div>

      <form className="my-3" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-2">
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

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-9 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Send OTP &rarr;
          <BottomGradient />
        </button>
      </form>
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

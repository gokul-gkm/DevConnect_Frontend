import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/utils/validation/userValidation";
import { useSearchParams, Navigate } from "react-router-dom";
import { useResetPassword } from "@/hooks/userAuth/useResetPassword";
import * as z from "zod";
import { Loader2 } from "lucide-react";

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function UserResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { resetPassword, isResetting } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  if (!token) {
    return <Navigate to="/auth/forgot-password" replace />;
  }

  const onSubmit = (data: ResetPasswordData) => {
    resetPassword({
      token,
      password: data.password,
    });
  };

  return (
    <div className="max-w-sm w-full mx-auto rounded-none md:rounded-xl px-4 py-4 md:p-8 bg-white dark:bg-black mb-20 mt-24 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
      <div className="text-center">
        <h2 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">
          Reset your password
        </h2>
        <p className="text-neutral-600 text-xs max-w-xs mt-2 dark:text-neutral-300">
          Please enter your new password.
        </p>
      </div>

      <form className="my-3" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-md h-9 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
          type="submit"
          disabled={isResetting}
        >
          {isResetting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Resetting...
              </>
            ) : (
              "Reset Password →"
            )}
          
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
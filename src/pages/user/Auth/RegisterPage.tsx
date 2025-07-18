"use client";
import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
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
    // reset,
  } = useForm<IRegisterData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: IRegisterData) => {
    registerUser(data);
  };

  return (
    <div className="max-w-sm w-full mx-auto rounded-none md:rounded-xl px-4 py-4 md:p-8 bg-black dark:bg-black mb-20 mt-24 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
      <div className="text-center">
        <h2 className="font-semibold text-lg text-neutral-200 dark:text-neutral-200">
          Create an account
        </h2>
        <p className="text-neutral-300 text-xs max-w-xs mt-2 dark:text-neutral-300">
          Join us! Please fill in your details to get started.
        </p>
      </div>

      <form className="my-3" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Enter your username" type="text" {...register("username")} />
          {errors.username && (
            <span className="text-xs text-red-500">
              {errors.username.message}
            </span>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="example@gmail.com" type="email" {...register("email")} />
          {errors.email && (
            <span className="text-xs text-red-500">
              {errors.email.message}
            </span>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-2">
          <Label htmlFor="contact">Contact</Label>
          <Input id="contact" placeholder="9876-543-210" type="tel" {...register("contact")} />
          {errors.contact && (
            <span className="text-xs text-red-500">
              {errors.contact.message}
            </span>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" {...register("password")} />
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <Input id="confirmpassword" placeholder="••••••••" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </LabelInputContainer>

        <button
          type="submit"
          disabled={isRegistering}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-xl h-9 font-medium text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
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

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

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

      <div className="text-center">
        <p className="text-neutral-600 text-xs mt-2 dark:text-neutral-300">
          Already have an account?{" "}
          <Link to={"/auth/login"}>
            <span className="text-blue-700 hover:underline">Sign In</span>
          </Link>
        </p>
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
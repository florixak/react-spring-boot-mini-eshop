import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { verifyEmailSchema, type VerifyEmailValues } from "@/lib/schema";
import { resendVerificationCode, verifyEmailCode } from "@/lib/api";
import { Route } from "@/routes/auth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useUserStore } from "@/stores/useUserStore";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const CODE_COOLDOWN = 30; // seconds

const VerifyEmail = () => {
  const search = Route.useSearch() as {
    email?: string;
    mode?: string;
    redirectTo?: string;
  };
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  const urlEmail = (): string => {
    try {
      return search.email && String(search.email).trim().length > 0
        ? String(search.email).trim()
        : "";
    } catch {
      return "";
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: urlEmail(), code: "" },
  });

  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    let timer: number | undefined;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            window.clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [cooldown]);

  const onSubmit = async (values: VerifyEmailValues) => {
    try {
      if (!values.email || values.email.length === 0) {
        toast.error("Email is required.");
        return;
      }
      if (!values.code || values.code.length === 0) {
        toast.error("Verification code is required.");
        return;
      }
      await verifyEmailCode({ email: values.email, code: values.code });
      reset();
      toast.success(
        isAuthenticated
          ? "Email verified successfully."
          : "Email verified — you can now sign in."
      );
      if (isAuthenticated) {
        navigate({ to: "/account", search: { section: "profile" } });
      } else {
        navigate({ to: "/auth", search: { mode: "login" } });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Verification failed";
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await resendVerificationCode(urlEmail());
      toast.success("Verification code resent to email.");
      setCooldown(CODE_COOLDOWN);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to resend code";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      <div>
        <Label className="text-sm font-semibold text-primary">Email</Label>
        <Input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          defaultValue={urlEmail()}
          disabled={urlEmail().length > 0 || isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label className="text-sm font-semibold text-primary">
          Verification code
        </Label>
        <InputOTP
          maxLength={6}
          value={watch("code")}
          onChange={(value) => setValue("code", value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {errors.code && (
          <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify email"}
        </Button>

        <div className="text-right">
          <Button
            type="button"
            variant="link"
            className={`text-sm underline text-secondary-500 disabled:opacity-50`}
            onClick={handleResend}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend code"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default VerifyEmail;

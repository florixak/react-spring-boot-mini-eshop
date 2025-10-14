// components/auth/ForgotPasswordForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/schema";
import { requestResetPassword } from "@/lib/api";
import toast from "react-hot-toast";

type ForgotPasswordFormProps = {
  redirectTo?: string;
};

const ForgotPasswordForm = ({ redirectTo }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestResetPassword(data.email);

      if (!response.success) {
        throw new Error(response.message || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues("email");
    if (email) {
      await onSubmit({ email });
    }
  };

  if (success) {
    return (
      <div className="space-y-4 font-inter text-center">
        <div className="flex justify-center">
          <CheckCircle className="size-16 text-green-500" />
        </div>

        <div className="text-sm text-secondary-200 space-y-2">
          <p>Didn't receive the email?</p>
          <ul className="text-xs space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure the email address is correct</li>
            <li>• Wait a few minutes for delivery</li>
          </ul>
        </div>

        <Button
          onClick={handleResendEmail}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Resending..." : "Resend Email"}
        </Button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Separator orientation="horizontal" className="bg-secondary-100" />

        <Link
          to="/auth"
          search={{ mode: "login", redirectTo }}
          className="inline-flex items-center gap-2 text-sm text-secondary-200 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      <div className="mb-4">
        <Link
          to="/auth"
          search={{ mode: "login", redirectTo }}
          className="inline-flex items-center gap-2 text-sm text-secondary-200 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Login
        </Link>
      </div>

      <div>
        <Label className="text-sm font-semibold text-primary">
          Email Address
        </Label>
        <Input
          {...register("email")}
          type="email"
          className="mt-1"
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="text-sm text-secondary-200 bg-secondary-50 p-3 rounded-md">
        <p className="font-medium text-primary mb-1">What happens next?</p>
        <ul className="text-xs space-y-1">
          <li>• We'll send a secure link to your email</li>
          <li>• Click the link to create a new password</li>
          <li>• The link expires in 1 hour for security</li>
        </ul>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
      </Button>

      <Separator orientation="horizontal" className="bg-secondary-100" />

      <p className="mt-4 text-sm text-primary text-center">
        Don't have an account?{" "}
        <Link
          to="/auth"
          search={{ mode: "register", redirectTo }}
          className="text-secondary-200 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;

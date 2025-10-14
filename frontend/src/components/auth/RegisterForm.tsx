import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { Route } from "@/routes/auth";
import { Separator } from "../ui/separator";
import { registerSchema, type RegisterFormData } from "@/lib/schema";
import { useUserStore } from "@/stores/useUserStore";
import toast from "react-hot-toast";

type RegisterFormProps = {
  redirectTo?: string;
};

const RegisterForm = ({ redirectTo }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = Route.useNavigate();
  const { register: registerUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: "",
      });

      reset();
      toast.success("Registration successful! Please verify your email.");

      setTimeout(() => {
        navigate({
          to: "/auth",
          search: { mode: "verify-email", redirectTo, email: data.email },
        });
      }, 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="firstName"
            className="text-sm font-semibold text-primary"
          >
            First Name
          </Label>
          <Input
            {...register("firstName")}
            className="mt-1"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="lastName"
            className="text-sm font-semibold text-primary"
          >
            Last Name
          </Label>
          <Input
            {...register("lastName")}
            className="mt-1"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-semibold text-primary">
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

      <div>
        <Label
          htmlFor="username"
          className="text-sm font-semibold text-primary"
        >
          Username
        </Label>
        <Input
          {...register("username")}
          className="mt-1"
          placeholder="Choose a username"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="password"
          className="text-sm font-semibold text-primary"
        >
          Password
        </Label>
        <div className="relative mt-1">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-primary" />
            ) : (
              <Eye className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-primary"
        >
          Confirm Password
        </Label>
        <div className="relative mt-1">
          <Input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-primary" />
            ) : (
              <Eye className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <Separator orientation="horizontal" className="bg-secondary-100" />

      <p className="mt-4 text-sm text-primary text-center">
        Already have an account?{" "}
        <Link
          to="/auth"
          search={{ mode: "login", redirectTo }}
          className="text-secondary-200 hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;

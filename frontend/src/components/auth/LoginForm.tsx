import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Route } from "@/routes/auth";
import { Separator } from "../ui/separator";
import { useUserStore } from "@/stores/useUserStore";
import toast from "react-hot-toast";

type LoginFormProps = {
  redirectTo?: string;
};

const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = Route.useNavigate();
  const { login } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await login({
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      });

      reset();

      toast.success("Logged in successfully!");

      navigate({
        to: "/account",
        replace: true,
        search: {
          section: "profile",
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      <div>
        <Label className="text-sm font-semibold text-primary">
          Email or Username
        </Label>
        <Input
          {...register("emailOrUsername")}
          className="mt-1"
          placeholder="Enter your email or username"
        />
        {errors.emailOrUsername && (
          <p className="text-red-500 text-xs mt-1">
            {errors.emailOrUsername.message}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-semibold text-primary">Password</Label>
        <div className="relative mt-1">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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

      <div className="text-right">
        <Link
          to="/auth"
          search={{ mode: "forgot-password", redirectTo }}
          className="text-sm text-secondary-200 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
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

export default LoginForm;

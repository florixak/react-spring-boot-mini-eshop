import { Route } from "@/routes/auth";
import LoginForm from "./LoginForm";
import AuthCard from "./AuthCard";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerifyEmail from "./VerifyEmail";

const AuthContent = () => {
  const search = Route.useSearch();

  const renderContent = () => {
    switch (search.mode) {
      case "login":
        return (
          <AuthCard title="Welcome Back!" description="Login to your account">
            <LoginForm />
          </AuthCard>
        );
      case "register":
        return (
          <AuthCard
            title="Create an Account"
            description="Sign up to get started"
          >
            <RegisterForm />
          </AuthCard>
        );
      case "forgot-password":
        return (
          <AuthCard title="Forgot Password" description="Reset your password">
            <ForgotPasswordForm />
          </AuthCard>
        );
      case "verify-email":
        return (
          <AuthCard
            title="Verify Your Email"
            description="Please check your email to verify your account"
          >
            <VerifyEmail />
          </AuthCard>
        );
      default:
        return (
          <AuthCard title="Welcome Back!" description="Login to your account">
            <LoginForm />
          </AuthCard>
        );
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 gap-5">
      <h1 className="text-4xl font-bold text-primary font-playfair">Minimal</h1>
      {renderContent()}
      <p className="text-center text-secondary-200 text-xs max-w-xs mx-auto">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </section>
  );
};

export default AuthContent;

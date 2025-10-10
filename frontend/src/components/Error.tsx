import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type ErrorProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
};

const Error = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  actionLabel = "Go Home",
  actionHref = "/",
}: ErrorProps) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-white">
      <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
      <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
      <p className="text-secondary-400 mb-6 text-center max-w-md">{message}</p>
      <Button asChild>
        <Link to={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
};

export default Error;

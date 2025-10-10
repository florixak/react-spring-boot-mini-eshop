import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { resendVerificationCode } from "@/lib/api";
import { useUserStore } from "@/stores/useUserStore";

const NotVerifiedModal = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const handleVerifyClick = async () => {
    if (!user?.email) {
      toast.error("No email available to resend code.");
      return;
    }
    try {
      await resendVerificationCode(user.email);
      toast.success("Verification code resent to your email.");
      navigate({
        to: "/auth",
        search: { mode: "verify-email", email: user.email },
      });
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to resend code.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="relative flex flex-row gap-2 items-center cursor-pointer text-yellow-500">
        <span className="absolute text-sm hidden sm:block -left-20 top-1/2 transform -translate-y-1/2">
          Not Verified
        </span>
        <Info className="size-5" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Email Not Verified</AlertDialogTitle>
          <AlertDialogDescription>
            You will not be able to access all features until your email is
            verified. Please verify your email by clicking the button below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleVerifyClick}
            className="cursor-pointer"
          >
            Verify Email
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NotVerifiedModal;

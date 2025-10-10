import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { updateUserPassword } from "@/lib/api";
import FormField from "../FormField";
import { useNavigate } from "@tanstack/react-router";

const SettingsSection = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, isSubmitting, isDirty },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await trigger([
      "currentPassword",
      "newPassword",
      "confirmNewPassword",
    ]);

    if (!isValid) {
      console.log("Form is invalid");
      return;
    }

    const response = await updateUserPassword(
      getValues("currentPassword"),
      getValues("newPassword")
    );

    if (response.success) {
      navigate({
        to: "/auth",
        replace: true,
        search: { mode: "login", redirectTo: "" },
      });
    } else {
      console.error("Failed to update password:", response.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary font-playfair">
            Account Settings
          </h2>
          <p className="text-secondary-200">
            Manage your account preferences and security
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <h3 className="text-lg font-semibold text-primary font-playfair mb-4">
              Security
            </h3>
            <div className="space-y-4">
              <FormField
                label="Current Password"
                id="currentPassword"
                type="password"
                register={register}
                isSubmitting={isSubmitting}
                error={errors.currentPassword?.message}
              />

              <FormField
                label="New Password"
                id="newPassword"
                type="password"
                register={register}
                isSubmitting={isSubmitting}
                error={errors.newPassword?.message}
              />

              <FormField
                label="Confirm New Password"
                id="confirmNewPassword"
                type="password"
                register={register}
                isSubmitting={isSubmitting}
                error={errors.confirmNewPassword?.message}
              />

              <Button variant="outline" disabled={isSubmitting || !isDirty}>
                Update Password
              </Button>
            </div>
          </form>

          <Separator orientation="horizontal" className="bg-secondary-100" />

          <div>
            <h3 className="text-lg font-semibold text-primary font-playfair mb-4">
              Danger Zone
            </h3>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;

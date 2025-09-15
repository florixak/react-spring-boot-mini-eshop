import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { useUserStore } from "@/stores/useUserStore";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/schema";
import { updateUserProfile } from "@/lib/api";
import FormField from "../FormField";

const ProfileSection = () => {
  const { user } = useUserStore();
  const {
    register,
    formState: { errors, isSubmitting, isDirty },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "",
    },
    resolver: zodResolver(profileSchema),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await trigger([
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "postalCode",
      "country",
    ]);
    if (!isValid) {
      console.log("Form is invalid");
      return;
    }
    if (!isDirty) {
      console.log("No changes detected");
      return;
    }

    const response = await updateUserProfile(getValues());

    if (response.success) {
      console.log("Profile updated successfully");
    } else {
      console.error("Failed to update profile:", response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary font-playfair">
            Personal Information
          </h2>
          <p className="text-secondary-200">
            Update your account details and profile information
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              id="firstName"
              register={register}
              isSubmitting={isSubmitting}
              error={errors.firstName?.message}
            />
            <FormField
              label="Last Name"
              id="lastName"
              register={register}
              isSubmitting={isSubmitting}
              error={errors.lastName?.message}
            />
          </div>

          <FormField
            label="Email Address"
            id="email"
            type="email"
            register={register}
            isSubmitting={isSubmitting}
            error={errors.email?.message}
          />

          <FormField
            label="Phone Number"
            id="phone"
            type="tel"
            register={register}
            isSubmitting={isSubmitting}
            error={errors.phone?.message}
          />

          <Separator className="my-6 bg-secondary-100" />

          <h3 className="text-lg font-semibold text-primary font-playfair">
            Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Street Address"
              id="address"
              register={register}
              isSubmitting={isSubmitting}
              error={errors.address?.message}
              className="md:col-span-2"
            />
            <FormField
              label="City"
              id="city"
              register={register}
              isSubmitting={isSubmitting}
              error={errors.city?.message}
            />
            <FormField
              label="State/Province"
              id="state"
              register={register}
              isSubmitting={isSubmitting}
              error={errors.state?.message}
            />
            <FormField
              label="Postal Code"
              id="postalCode"
              register={register}
              isSubmitting={isSubmitting}
              error={errors.postalCode?.message}
            />
            <FormField
              label="Country"
              id="country"
              register={register}
              isSubmitting={isSubmitting}
              error={errors.country?.message}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !isDirty}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProfileSection;

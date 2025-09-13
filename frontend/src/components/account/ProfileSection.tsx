import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useUserStore } from "@/stores/useUserStore";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/schema";

const ProfileSection = () => {
  const { user } = useUserStore();
  const {
    register,
    formState: { errors },
    trigger,
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
    console.log("Form is valid, submitting...");
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
            <div>
              <Label className="text-sm font-semibold text-primary">
                First Name
              </Label>
              <Input {...register("firstName")} className="mt-1" />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                Last Name
              </Label>
              <Input {...register("lastName")} className="mt-1" />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              Email Address
            </Label>
            <Input {...register("email")} type="email" className="mt-1" />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              Phone Number
            </Label>
            <Input {...register("phone")} className="mt-1" />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <Separator className="my-6 bg-secondary-100" />

          <h3 className="text-lg font-semibold text-primary font-playfair">
            Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-sm font-semibold text-primary">
                Street Address
              </Label>
              <Input {...register("address")} className="mt-1" />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">City</Label>
              <Input {...register("city")} className="mt-1" />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                State
              </Label>
              <Input {...register("state")} className="mt-1" />
              {errors.state && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                ZIP Code
              </Label>
              <Input {...register("postalCode")} className="mt-1" />
              {errors.postalCode && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                Country
              </Label>
              <Input {...register("country")} className="mt-1" />
              {errors.country && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProfileSection;

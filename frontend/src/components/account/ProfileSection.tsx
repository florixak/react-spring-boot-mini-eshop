import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useUserStore } from "@/stores/useUserStore";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const ProfileSection = () => {
  const { user } = useUserStore();

  return (
    <div className="space-y-6">
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
              <Input defaultValue={user?.firstName} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                Last Name
              </Label>
              <Input defaultValue={user?.lastName} className="mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              Email Address
            </Label>
            <Input type="email" defaultValue={user?.email} className="mt-1" />
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              Phone Number
            </Label>
            <Input type="tel" defaultValue={user?.phone} className="mt-1" />
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
              <Input defaultValue={user?.address} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">City</Label>
              <Input defaultValue={user?.city} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                State
              </Label>
              <Input defaultValue={user?.state} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                ZIP Code
              </Label>
              <Input defaultValue={user?.postalCode} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-primary">
                Country
              </Label>
              <Input defaultValue={user?.country} className="mt-1" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;

import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Input } from "./ui/input";

const ProfileSection = () => {
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
              <label className="text-sm font-semibold text-primary">
                First Name
              </label>
              <Input defaultValue="John" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold text-primary">
                Last Name
              </label>
              <Input defaultValue="Doe" className="mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-primary">
              Email Address
            </label>
            <Input
              type="email"
              defaultValue="john.doe@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-primary">
              Phone Number
            </label>
            <Input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>

          <Separator className="my-6" />

          <h3 className="text-lg font-semibold text-primary font-playfair">
            Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-primary">
                Street Address
              </label>
              <Input defaultValue="123 Main Street" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold text-primary">City</label>
              <Input defaultValue="New York" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold text-primary">
                ZIP Code
              </label>
              <Input defaultValue="10001" className="mt-1" />
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

import { Card, CardContent, CardHeader } from "../ui/card";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const SettingsSection = () => {
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
          <div>
            <h3 className="text-lg font-semibold text-primary font-playfair mb-4">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">
                    Email Notifications
                  </p>
                  <p className="text-sm text-secondary-200">
                    Receive updates about your orders
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">Marketing Emails</p>
                  <p className="text-sm text-secondary-200">
                    Get notified about sales and new products
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <Separator className="bg-secondary-100" />

          <div>
            <h3 className="text-lg font-semibold text-primary font-playfair mb-4">
              Security
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-primary">
                  Current Password
                </label>
                <Input type="password" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold text-primary">
                  New Password
                </label>
                <Input type="password" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold text-primary">
                  Confirm New Password
                </label>
                <Input type="password" className="mt-1" />
              </div>
              <Button variant="outline">Update Password</Button>
            </div>
          </div>

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

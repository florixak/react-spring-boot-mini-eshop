import { Mail, Phone, MapPin } from "lucide-react";
import Section from "./Section";
import { Card, CardContent } from "./ui/card";

const GetInTouch = () => {
  return (
    <Section
      title="Get in Touch"
      description="Have questions about our products or need design advice? We'd love to hear from you."
      bgClassName="bg-secondary-50"
    >
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-secondary-100 text-center">
          <CardContent className="p-6 space-y-4">
            <Mail className="h-8 w-8 text-secondary-200 mx-auto" />
            <div>
              <h3 className="font-semibold text-primary mb-2">Email Us</h3>
              <p className="text-secondary-200">hello@minimal.com</p>
              <p className="text-secondary-200">support@minimal.com</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-secondary-100 text-center">
          <CardContent className="p-6 space-y-4">
            <Phone className="h-8 w-8 text-secondary-200 mx-auto" />
            <div>
              <h3 className="font-semibold text-primary mb-2">Call Us</h3>
              <p className="text-secondary-200">1-800-MINIMAL</p>
              <p className="text-secondary-200 text-sm">Mon-Fri 9AM-6PM EST</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-secondary-100 text-center">
          <CardContent className="p-6 space-y-4">
            <MapPin className="h-8 w-8 text-secondary-200 mx-auto" />
            <div>
              <h3 className="font-semibold text-primary mb-2">Visit Us</h3>
              <p className="text-secondary-200">123 Design Street</p>
              <p className="text-secondary-200">New York, NY 10001</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
};

export default GetInTouch;

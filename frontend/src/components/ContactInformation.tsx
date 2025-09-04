import { CONTACT_INFO } from "@/constants";
import Section from "./Section";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const ContactInformation = () => {
  return (
    <Section
      title="Contact Information"
      description="You can reach us at the following contact points."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CONTACT_INFO.map((info, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <info.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg text-primary">
                {info.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-inter">
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 mb-1">
                  {detail}
                </p>
              ))}
              <p className="text-sm text-secondary-200 mt-2 font-medium">
                {info.extra}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default ContactInformation;

import { MessageSquare, Star, Phone } from "lucide-react";
import Section from "../Section";
import { Badge } from "../ui/badge";

const ContactHeader = () => {
  return (
    <Section
      title="Get in Touch"
      description="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      bgClassName="bg-secondary-50"
      className="pt-32"
    >
      <div className="flex flex-wrap justify-center gap-4 font-inter">
        <Badge variant="secondary" className="bg-amber-100 text-amber-900">
          <MessageSquare className="h-3 w-3 mr-1" />
          24/7 Support
        </Badge>
        <Badge variant="secondary" className="bg-amber-100 text-amber-900">
          <Star className="h-3 w-3 mr-1" />
          5-Star Service
        </Badge>
        <Badge variant="secondary" className="bg-amber-100 text-amber-900">
          <Phone className="h-3 w-3 mr-1" />
          Quick Response
        </Badge>
      </div>
    </Section>
  );
};

export default ContactHeader;

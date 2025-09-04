import Section from "./Section";
import ContactForm from "./ContactForm";
import { Card, CardContent, CardHeader } from "./ui/card";
import Faq from "./Faq";
import { Phone, Mail, MessageSquare, CircleQuestionMark } from "lucide-react";
import Button from "./Button";

const SendMessage = () => {
  return (
    <Section
      title="Send a Message"
      description="Fill out the form below and we'll get back to you within 24 hours."
      bgClassName="bg-secondary-50"
      id="contact"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-4xl h-auto">
        <Card className="p-4">
          <CardHeader className="text-left p-2">
            <h3 className="text-2xl font-semibold text-primary">
              Contact Form
            </h3>
            <p className="text-secondary-200 mt-1">
              We'll respond to your message as quickly as possible.
            </p>
          </CardHeader>
          <ContactForm />
        </Card>
        <Card className="p-4">
          <CardHeader className="text-left p-2">
            <h3 className="text-2xl font-semibold text-primary">
              Need Immediate Help?
            </h3>
            <p className="text-secondary-200 mt-1">Find us on the map</p>
          </CardHeader>
          <CardContent className="space-y-3 font-inter">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call: +1 (555) 123-4567
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email: support@minimalshop.com
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Live Chat (9AM-8PM EST)
            </Button>
          </CardContent>
        </Card>
        <Card className="p-4 row-span-1 md:col-span-2">
          <CardHeader className="text-left p-2">
            <h3 className="text-2xl font-semibold text-primary flex items-center">
              <CircleQuestionMark className="inline-block mr-2" />
              Frequently Asked Questions
            </h3>
            <p className="text-secondary-200 mt-1">
              Quick answers to common questions
            </p>
          </CardHeader>
          <Faq />
        </Card>
      </div>
    </Section>
  );
};

export default SendMessage;

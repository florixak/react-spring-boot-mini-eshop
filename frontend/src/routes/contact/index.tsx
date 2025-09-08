import ContactHeader from "@/components/contact/ContactHeader";
import ContactInformation from "@/components/about/ContactInformation";
import SendMessage from "@/components/contact/SendMessage";
import VisitOurStore from "@/components/contact/VisitOurStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact/")({
  component: Contact,
});

function Contact() {
  return (
    <>
      <ContactHeader />
      <ContactInformation />
      <SendMessage />
      <VisitOurStore />
    </>
  );
}

import ContactHeader from "@/components/ContactHeader";
import ContactInformation from "@/components/ContactInformation";
import SendMessage from "@/components/SendMessage";
import VisitOurStore from "@/components/VisitOurStore";
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

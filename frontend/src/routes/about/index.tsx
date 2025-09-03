import Hero from "@/components/Hero";
import AboutImage from "@/assets/landing-image2.jpg";
import { createFileRoute } from "@tanstack/react-router";
import Statistics from "@/components/Statistics";
import OurMission from "@/components/OurMission";

export const Route = createFileRoute("/about/")({
  component: About,
});

function About() {
  return (
    <>
      <Hero
        title="Our Story of"
        subtitle="Minimal Living"
        description="Founded in 2009, Minimal began with a simple belief: that beautiful, functional design should be accessible to everyone. We curate timeless pieces that transform houses into homes."
        primaryButton={{
          text: "Shop Our Story",
          onClick: () => {},
        }}
        secondaryButton={{
          text: "Learn More",
          onClick: () => {},
        }}
        image={AboutImage}
      />
      <Statistics />
      <OurMission />
    </>
  );
}

import Hero from "@/components/home/Hero";
import AboutImage from "@/assets/landing-image2.jpg";
import { createFileRoute } from "@tanstack/react-router";
import Statistics from "@/components/about/Statistics";
import OurMission from "@/components/about/OurMission";
import OurValues from "@/components/about/OurValues";
import OurTeam from "@/components/about/OurTeam";
import Testimonials from "@/components/about/Testimonials";
import GetInTouch from "@/components/about/GetInTouch";
import AboutEnd from "@/components/about/AboutEnd";

export const Route = createFileRoute("/about/")({
  component: About,
});

function About() {
  const navigate = Route.useNavigate();
  const handleNavigateToShop = () => {
    navigate({
      to: "/shop",
      search: {
        category: "all",
        sortBy: "no-filter",
        view: "grid",
        query: "",
        price: "0-1000",
        stock: "in-stock",
      },
    });
  };
  const handleScrollToTeam = () => {
    const teamSection = document.getElementById("team");
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <Hero
        title="Our Story of"
        subtitle="Minimal Living"
        description="Founded in 2009, Minimal began with a simple belief: that beautiful, functional design should be accessible to everyone. We curate timeless pieces that transform houses into homes."
        primaryButton={{
          text: "Shop Our Story",
          onClick: handleNavigateToShop,
        }}
        secondaryButton={{
          text: "Meet Our Team",
          onClick: handleScrollToTeam,
        }}
        image={AboutImage}
      />
      <Statistics />
      <OurMission />
      <OurValues />
      <OurTeam />
      <Testimonials />
      <GetInTouch />
      <AboutEnd />
    </>
  );
}

import { Quote } from "lucide-react";
import AboutSection from "./AboutSection";

const OurMission = () => {
  return (
    <AboutSection
      title="Our Mission"
      description="To make beautiful, sustainable, and functional design accessible to
        everyone. We believe that your home should be a reflection of your
        values—simple, authentic, and thoughtfully curated."
      bgClassName="bg-secondary-50"
    >
      <div className="bg-white rounded-xl p-6 flex items-center justify-center flex-col max-w-2xl mx-auto shadow-md">
        <Quote className="size-8 text-secondary-200" />
        <blockquote className="mt-2 text-primary italic">
          "Design is not just what it looks like and feels like. Design is how
          it works. We create spaces that work beautifully for real life."
        </blockquote>
        <cite className="mt-4 block text-secondary-200 font-semibold">
          - Sarah Chen, Founder
        </cite>
      </div>
    </AboutSection>
  );
};

export default OurMission;

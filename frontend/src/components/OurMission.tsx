import { Quote } from "lucide-react";

const OurMission = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 md:px-16 lg:px-28 font-playfair space-y-6 bg-secondary-50">
      <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
      <p className="max-w-3xl mx-auto text-secondary-200 text-lg">
        To make beautiful, sustainable, and functional design accessible to
        everyone. We believe that your home should be a reflection of your
        values—simple, authentic, and thoughtfully curated.
      </p>
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
    </section>
  );
};

export default OurMission;

import { TESTIMONIALS } from "@/constants";
import Section from "./Section";
import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  return (
    <Section
      title="What Our Customers Say"
      description="Don't just take our word for it. Here's what our community has to say about their Minimal experience."
    >
      <div className="grid md:grid-cols-3 gap-8 text-left">
        {TESTIMONIALS.map((testimonial, index) => (
          <Card key={index} className="border-secondary-100">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="text-primary italic">
                "{testimonial.content}"
              </blockquote>
              <div>
                <cite className="text-primary font-semibold not-italic">
                  {testimonial.name}
                </cite>
                <p className="text-secondary-200 text-sm">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default Testimonials;

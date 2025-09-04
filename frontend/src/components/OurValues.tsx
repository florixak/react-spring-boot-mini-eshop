import { VALUES } from "@/constants";
import { Card, CardContent } from "./ui/card";
import AboutSection from "./AboutSection";

const OurValues = () => {
  return (
    <AboutSection
      title="Our Values"
      description="These principles guide everything we do, from product selection to customer service."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {VALUES.map((value, index) => (
          <Card
            key={index}
            className="border-secondary-100 hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                {<value.icon className="size-8 text-primary" />}
              </div>
              <h3 className="text-xl font-semibold text-amber-900">
                {value.title}
              </h3>
              <p className="text-amber-700 leading-relaxed">
                {value.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AboutSection>
  );
};

export default OurValues;

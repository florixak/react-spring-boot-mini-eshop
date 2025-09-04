import { MapPin } from "lucide-react";
import Section from "./Section";
import { Button } from "./ui/button";

const VisitOurStore = () => {
  return (
    <Section
      title="Visit Our Store"
      description="Explore our wide range of products and find what you love."
    >
      <div className="w-full max-w-2xl mx-auto text-center bg-gray-100 p-10 rounded-lg font-inter">
        <MapPin className="mx-auto mb-4 size-12 text-primary" />
        <h3 className="text-xl font-semibold mb-2 text-primary">
          MinimalShop Flagship Store
        </h3>
        <p className="text-gray-600 mb-1">
          123 Design Street, Minimalist District
        </p>
        <p className="text-gray-600 mb-1">New York, NY 10001</p>
        <Button variant="default" className="mt-4">
          Get Directions
        </Button>
      </div>
    </Section>
  );
};

export default VisitOurStore;

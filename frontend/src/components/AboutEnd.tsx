import { Route } from "@/routes/about";
import AboutSection from "./AboutSection";
import { Button } from "./ui/button";

const AboutEnd = () => {
  const navigate = Route.useNavigate();
  const handleShopCollectionClick = () => {
    navigate({
      to: "/shop",
      search: {
        category: "all",
        sortBy: "no-filter",
        view: "grid",
        query: "",
        rating: "any-rating",
        price: "0-1000",
        stock: "in-stock",
      },
    });
  };

  const handleSecondaryButtonClick = () => {
    navigate({
      to: "/contact",
    });
  };

  return (
    <AboutSection
      title="Ready to Transform Your Space?"
      description="Discover our curated collection of minimalist home essentials and start creating your perfect space today."
    >
      <div className="flex flex-col md:flex-row md:space-x-4">
        <Button
          variant="default"
          className="py-4 px-6"
          onClick={handleShopCollectionClick}
        >
          Shop Collection
        </Button>
        <Button
          variant="outline"
          className="py-4 px-6"
          onClick={handleSecondaryButtonClick}
        >
          Design Consultation
        </Button>
      </div>
    </AboutSection>
  );
};

export default AboutEnd;

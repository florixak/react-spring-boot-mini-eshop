import { Button } from "./ui/button";
import placeholderImg from "../assets/placeholder.svg";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col xl:flex-row gap-8 lg:gap-0 px-6 md:px-16 lg:px-28 py-24 xl:py-0 items-center justify-between bg-secondary bg-amber-50">
      <div>
        <h1 className="text-4xl lg:text-6xl font-bold text-primary font-playfair">
          Minimal Design,
          <br />
          Maximum Impact
        </h1>
        <h2 className="text-lg text-secondary-200 my-6 max-w-lg font-playfair">
          Discover our curated collection of minimalist home essentials. Clean
          lines, natural materials, timeless design.
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="default" className="py-4 px-6">
            Shop Collection
          </Button>
          <Button variant="outline" className="py-4 px-6">
            Learn More
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-[580px] flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={placeholderImg}
          alt="Hero Image"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;

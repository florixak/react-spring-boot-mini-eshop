import { Button } from "./ui/button";
import placeholderImg from "../assets/placeholder.svg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-evenly bg-secondary bg-amber-50">
      <div>
        <h1 className="text-6xl font-bold text-primary font-playfair">
          Minimal Design,
          <br />
          Maximum Impact
        </h1>
        <h2 className="text-lg text-secondary-200 my-6 max-w-lg font-playfair">
          Discover our curated collection of minimalist home essentials. Clean
          lines, natural materials, timeless design.
        </h2>
        <Button variant="default" className="py-4 px-6">
          Shop Collection
        </Button>
        <Button variant="outline" className="py-4 px-6">
          Learn More
        </Button>
      </div>

      <div className="relative size-[500px] flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={placeholderImg}
          alt="Hero Image"
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
    </section>
  );
};

export default Hero;

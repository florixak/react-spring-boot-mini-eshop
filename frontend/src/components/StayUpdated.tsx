import Button from "./Button";
import { Input } from "./ui/input";

const StayUpdated = () => {
  return (
    <section className="bg-secondary-50 py-24 text-center font-playfair space-y-6">
      <h2 className="text-3xl font-bold text-primary">Stay Updated</h2>
      <p className="text-secondary-200">
        Subscribe to our newsletter for the latest updates.
      </p>
      <form className="flex flex-row max-w-md mx-auto items-center gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          className="border border-secondary-200 rounded-lg bg-white py-5"
        />
        <Button className="bg-primary text-white rounded-lg">Subscribe</Button>
      </form>
    </section>
  );
};

export default StayUpdated;

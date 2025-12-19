import toast from "react-hot-toast";
import Button from "../Button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";

const StayUpdated = () => {
  const [inputValue, setInputValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !inputValue ||
      inputValue.trim() === "" ||
      !/\S+@\S+\.\S+/.test(inputValue)
    ) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed successfully!");
    formRef.current?.reset();
    setInputValue("");
  };

  return (
    <section className="bg-secondary-50 py-24 px-8 text-center font-playfair space-y-6">
      <h2 className="text-3xl font-bold text-primary">Stay Updated</h2>
      <p className="text-secondary-200">
        Subscribe to our newsletter for the latest updates.
      </p>
      <form
        className="flex flex-col sm:flex-row max-w-md mx-auto items-center gap-2"
        onSubmit={handleSubscribe}
        ref={formRef}
      >
        <Input
          type="email"
          placeholder="Enter your email"
          className="border rounded-lg bg-white py-5"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button className="bg-primary text-white rounded-lg">Subscribe</Button>
      </form>
    </section>
  );
};

export default StayUpdated;

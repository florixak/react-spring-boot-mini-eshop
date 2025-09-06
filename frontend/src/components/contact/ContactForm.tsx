import { CONTACT_CATEGORIES } from "@/constants";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";

const ContactForm = () => {
  return (
    <form className="flex flex-col space-y-4 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="text" placeholder="Your Name" className="w-full" />
        <Input type="email" placeholder="Your Email" className="w-full" />
      </div>
      <Select>
        <SelectTrigger className="w-full">
          <span>Select a category</span>
        </SelectTrigger>
        <SelectContent>
          {CONTACT_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="text" placeholder="Subject" className="w-full" />
      <Textarea
        placeholder="Your Message"
        rows={6}
        maxLength={500}
        className="w-full max-h-48"
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;

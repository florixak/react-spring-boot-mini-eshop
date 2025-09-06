import { FAQ_ITEMS } from "@/constants";

const Faq = () => {
  return (
    <div className="space-y-5 text-left font-inter p-2">
      {FAQ_ITEMS.map((item) => (
        <div key={item.question}>
          <h4 className="text-md font-semibold text-primary mb-2">
            {item.question}
          </h4>
          <p className="text-gray-600 mb-4 text-sm">{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default Faq;

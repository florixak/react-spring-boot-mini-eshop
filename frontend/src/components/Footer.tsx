import { Separator } from "./ui/separator";

const FOOTER_SECTIONS = [
  {
    title: "Minimal",
    description:
      "Curating beautiful, minimalist home essentials for modern living.",
    links: [],
  },
  {
    title: "Shop",
    links: ["All Products", "New Arrivals", "Best Sellers", "Sale"],
  },
  {
    title: "About Us",
    links: ["Our Story", "Mission", "Values"],
  },
  {
    title: "Customer Service",
    links: ["Contact Us", "Returns", "Shipping Info"],
  },
];

const Footer = () => {
  return (
    <div className="pt-24 pb-12 text-center font-playfair px-8 md:px-16 lg:px-36 space-y-12">
      <Separator orientation="horizontal" className="bg-secondary-100" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {FOOTER_SECTIONS.map((section, index) => (
          <div key={index} className="text-start space-y-4">
            <h2 className="text-xl text-primary">{section.title}</h2>
            {section.description && (
              <p className="text-secondary-200 text-sm">
                {section.description}
              </p>
            )}
            <ul className="text-sm text-secondary-200 space-y-4">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="space-y-2 flex flex-row justify-between items-start">
        <p className="text-sm text-secondary-200">
          &copy; {new Date().getFullYear()} Minimal. All rights reserved.
        </p>
        <div className="flex justify-center flex-col items-start">
          <p className="text-sm text-secondary-200">
            Follow us on social media:
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="#" className="text-secondary-200 hover:text-primary">
              Facebook
            </a>
            <a href="#" className="text-secondary-200 hover:text-primary">
              Instagram
            </a>
            <a href="#" className="text-secondary-200 hover:text-primary">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

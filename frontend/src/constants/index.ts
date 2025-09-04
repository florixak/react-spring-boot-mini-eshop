import { Leaf, Medal, Shield, Users } from "lucide-react";
import PlaceholderImage from "@/assets/placeholder.svg";

type ProductFilter = {
  value:
    | "price_low_to_high"
    | "price_high_to_low"
    | "newest_arrivals"
    | "best_rating"
    | "no-filter";
  label: string;
};

const PRODUCT_FILTERS: ProductFilter[] = [
  {
    value: "price_low_to_high",
    label: "Price: Low to High",
  },
  {
    value: "price_high_to_low",
    label: "Price: High to Low",
  },
  {
    value: "newest_arrivals",
    label: "Newest Arrivals",
  },
  {
    value: "best_rating",
    label: "Best Rating",
  },
];

const PAYMENT_METHODS = [
  "CREDIT_CARD",
  "PAYPAL",
  "BANK_TRANSFER",
  "CASH_ON_DELIVERY",
];

const STATISTICS = [
  {
    title: "Happy Customers",
    value: "50,000+",
  },
  {
    title: "Years Experience",
    value: "15+",
  },
  {
    title: "Curated Products",
    value: "200+",
  },
  {
    title: "Customer Satisfaction",
    value: "98%",
  },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We source materials responsibly and partner with eco-conscious manufacturers to minimize our environmental impact.",
  },
  {
    icon: Medal,
    title: "Quality Craftsmanship",
    description:
      "Every piece is carefully selected for its superior quality, durability, and timeless design that lasts for generations.",
  },
  {
    icon: Users,
    title: "Community Focus",
    description:
      "We support local artisans and small businesses, fostering a community of creators who share our passion for minimalist design.",
  },
  {
    icon: Shield,
    title: "Customer Trust",
    description:
      "Your satisfaction is our priority. We stand behind every product with comprehensive warranties and exceptional service.",
  },
];

const TEAM = [
  {
    name: "Sarah Chen",
    role: "Founder & Creative Director",
    image: PlaceholderImage,
    bio: "With 15 years in interior design, Sarah founded Minimal to bring accessible, beautiful design to every home.",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Product",
    image: PlaceholderImage,
    bio: "Marcus ensures every product meets our high standards for quality, functionality, and aesthetic appeal.",
  },
  {
    name: "Elena Rodriguez",
    role: "Sustainability Director",
    image: PlaceholderImage,
    bio: "Elena leads our commitment to environmental responsibility and ethical sourcing practices.",
  },
  {
    name: "David Kim",
    role: "Customer Experience",
    image: PlaceholderImage,
    bio: "David ensures every customer interaction reflects our values of care, quality, and attention to detail.",
  },
];

const TESTIMONIALS = [
  {
    name: "Jennifer Walsh",
    role: "Interior Designer",
    content:
      "Minimal has become my go-to source for clients who want clean, sophisticated pieces. The quality is consistently exceptional.",
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "Homeowner",
    content:
      "I've furnished my entire home with Minimal pieces. Each item is beautifully crafted and the customer service is outstanding.",
    rating: 5,
  },
  {
    name: "Lisa Park",
    role: "Architect",
    content:
      "The attention to detail and commitment to sustainability makes Minimal stand out. I recommend them to all my clients.",
    rating: 5,
  },
];

const PRODUCT_RATINGS = ["Any Rating", "4+ Stars", "4,5+ Stars"];

export {
  PRODUCT_FILTERS,
  PAYMENT_METHODS,
  PRODUCT_RATINGS,
  STATISTICS,
  VALUES,
  TEAM,
  TESTIMONIALS,
};

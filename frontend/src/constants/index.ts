import {
  CheckCircle,
  Clock,
  CreditCard,
  Leaf,
  Mail,
  MapPin,
  Medal,
  Phone,
  Shield,
  Truck,
  Users,
} from "lucide-react";
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

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: ["123 Design Street", "Minimalist District", "New York, NY 10001"],
    extra: "Open 7 days a week",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (555) 123-4567", "Toll-free: 1-800-MINIMAL"],
    extra: "Mon-Fri: 9AM-8PM EST",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@minimalshop.com", "support@minimalshop.com"],
    extra: "We reply within 24 hours",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon-Fri: 9:00 AM - 8:00 PM", "Sat-Sun: 10:00 AM - 6:00 PM"],
    extra: "EST (Eastern Standard Time)",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for all items in original condition. Free returns on orders over $100.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days. Express shipping (1-2 days) and overnight options available.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship worldwide. International shipping typically takes 7-14 business days depending on location.",
  },
  {
    question: "Can I track my order?",
    answer:
      "You'll receive a tracking number via email once your order ships. You can also track orders in your account.",
  },
];

const CONTACT_CATEGORIES = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Support" },
  { value: "product", label: "Product Question" },
  { value: "shipping", label: "Shipping & Returns" },
  { value: "technical", label: "Technical Support" },
  { value: "partnership", label: "Partnerships" },
  { value: "feedback", label: "Feedback & Suggestions" },
];

const PRODUCT_RATINGS = ["Any Rating", "4+ Stars", "4,5+ Stars"];

const CHECKOUT_STEPS = [
  { number: 1, title: "Shipping", icon: Truck },
  { number: 2, title: "Payment", icon: CreditCard },
  { number: 3, title: "Confirmation", icon: CheckCircle },
];

export {
  PRODUCT_FILTERS,
  PAYMENT_METHODS,
  PRODUCT_RATINGS,
  STATISTICS,
  VALUES,
  TEAM,
  TESTIMONIALS,
  CONTACT_INFO,
  FAQ_ITEMS,
  CONTACT_CATEGORIES,
  CHECKOUT_STEPS,
};

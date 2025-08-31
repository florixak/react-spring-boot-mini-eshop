import { Link } from "@tanstack/react-router";
import SearchBar from "./SearchBar";
import { Heart, ShoppingCart, User } from "lucide-react";

const navLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Shop",
    href: "/products",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const Header = () => {
  return (
    <header className="fixed flex flex-row items-center justify-between px-36 py-4 bg-white shadow-sm font-playfair w-full z-50">
      <Link to="/">
        <h1 className="text-2xl font-bold text-primary">Minimal</h1>
      </Link>
      <nav className="flex flex-row gap-10 items-center">
        {navLinks.map((link) => (
          <Link key={link.title} to={link.href} className="text-primary">
            {link.title}
          </Link>
        ))}
      </nav>
      <div className="flex flex-row gap-10 items-center">
        <SearchBar />
        <User size={32} className="text-primary" />
        <Heart size={32} className="text-primary" />
        <ShoppingCart size={32} className="text-primary" />
      </div>
    </header>
  );
};

export default Header;

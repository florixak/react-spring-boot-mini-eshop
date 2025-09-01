import { Link } from "@tanstack/react-router";
import SearchBar from "./SearchBar";
import { Heart, Menu, ShoppingCart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

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
    <header className="fixed flex flex-row items-center justify-between px-6 md:px-16 lg:px-36 py-4 bg-white shadow-sm font-playfair w-full z-50">
      <Link to="/" search={{ category: "all", filter: "no-filter" }}>
        <h1 className="text-2xl font-bold text-primary">Minimal</h1>
      </Link>
      <nav className="hidden lg:flex flex-row gap-10 items-center">
        {navLinks.map((link) => (
          <Link key={link.title} to={link.href} className="text-primary">
            {link.title}
          </Link>
        ))}
      </nav>
      <div className="flex flex-row gap-5 md:gap-10 items-center">
        <SearchBar className="hidden md:block" />
        <User className="text-primary size-6 md:size-8" />
        <Heart className="text-primary size-6 md:size-8" />
        <ShoppingCart className="text-primary size-6 md:size-8" />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-amber-900"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <nav className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => (
                <Link key={link.title} to={link.href} className="text-primary">
                  {link.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;

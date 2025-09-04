import { Link } from "@tanstack/react-router";
import { Heart, Menu, ShoppingCart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const navLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Shop",
    href: "/shop",
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
  const cartItems = 3;

  return (
    <header className="fixed flex flex-row items-center justify-between px-6 md:px-16 lg:px-36 py-4 bg-white shadow-sm font-playfair w-full z-50">
      <Link
        to="/"
        search={{ category: "all", sortBy: "no-filter", view: "grid" }}
      >
        <h1 className="text-2xl font-bold text-primary">Minimal</h1>
      </Link>
      <nav className="hidden lg:flex flex-row gap-10 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.title}
            to={link.href}
            activeProps={{ className: "font-bold text-primary cursor-default" }}
            inactiveProps={{
              className: "text-primary hover:text-secondary-200",
            }}
          >
            {link.title}
          </Link>
        ))}
      </nav>
      <div className="flex flex-row gap-2 md:gap-6 items-center">
        <Link to="/account" search={{ section: "general" }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-secondary-200"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>

        <Link to="/account" search={{ section: "wishlist" }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-secondary-200"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-primary hover:text-secondary-200"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-inter">
              {cartItems}
            </Badge>
          )}
        </Button>

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

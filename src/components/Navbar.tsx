
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LoginDialog from "./LoginDialog";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Enquiry", path: "/enquiry" },
    { name: "Contact", path: "/contact" },
  ];

  // Add dashboard link for authenticated users
  if (user) {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue">
              SS <span className="text-steel">STEEL</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-steel-dark hover:text-blue transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <LoginDialog />
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center gap-4">
            <LoginDialog />
            <button
              onClick={toggleMenu}
              className="text-steel focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-steel-dark hover:text-blue py-2 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

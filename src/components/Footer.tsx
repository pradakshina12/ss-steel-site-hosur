
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-steel-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">SS STEEL INDIA CORPORATION</h3>
            <p className="mb-4">
              Your trusted supplier of quality steel products in Hosur, Tamil Nadu.
            </p>
            <div className="flex items-center mb-2">
              <MapPin size={16} className="mr-2" />
              <p className="text-sm">
                756/6-B, Opp Anand Electronics, Krishnagiri Main Road,
                <br />Hosur, Tamil Nadu – 635109
              </p>
            </div>
            <div className="flex items-center mb-2">
              <Phone size={16} className="mr-2" />
              <p className="text-sm">+91 63820 85337, +91 87540 10925</p>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="mr-2" />
              <p className="text-sm">sales@sssteelindia.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-light transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-light transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="hover:text-blue-light transition-colors">
                  Enquiry
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-light transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Business Hours</h3>
            <p className="mb-2">Monday to Saturday:</p>
            <p className="mb-4">9:00 AM - 7:00 PM</p>
            <p className="mb-2">Sunday:</p>
            <p>Closed</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {currentYear} SS Steel India Corporation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

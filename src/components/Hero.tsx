
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue to-blue-light text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to SS STEEL INDIA CORPORATION
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            Best Deal in Iron and Steel
          </h2>
          <p className="text-lg mb-6">
            Located on NH 7 - Hosur, just 40 KM from Bengaluru. Easy access for loading 
            and delivery to nearby industrial areas and construction sites.
          </p>
          <p className="mb-8">
            <span className="font-semibold">Business Hours:</span> Mon - Sat: 9:00 am to 7:00 pm
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="bg-white text-blue hover:bg-gray-100 font-semibold"
            >
              <Link to="/products">View All Products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue font-semibold"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

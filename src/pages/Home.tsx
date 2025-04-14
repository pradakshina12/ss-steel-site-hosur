
import Hero from "@/components/Hero";
import ValueProposition from "@/components/ValueProposition";
import ProductCategories from "@/components/ProductCategories";
import ContactInfo from "@/components/ContactInfo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Hero />
      <ValueProposition />
      <ProductCategories />
      
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-steel-dark">Ready to Discuss Your Steel Requirements?</h2>
          <p className="text-lg text-steel mb-8 max-w-3xl mx-auto">
            Contact us today to learn more about our products and how we can support your projects.
          </p>
          <Button asChild className="bg-blue hover:bg-blue-dark">
            <Link to="/enquiry">Make an Enquiry</Link>
          </Button>
        </div>
      </div>
      
      <ContactInfo />
    </div>
  );
};

export default Home;

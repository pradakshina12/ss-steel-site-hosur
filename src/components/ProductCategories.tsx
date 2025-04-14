
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProductCategories = () => {
  const categories = [
    {
      name: "Structural Materials",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      description: "High-quality structural steel for construction and fabrication",
      link: "/products#structural"
    },
    {
      name: "Steel Pipes",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      description: "Variety of steel pipes for industrial and construction applications",
      link: "/products#pipes"
    },
    {
      name: "Sheets & Plates",
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b",
      description: "Steel sheets and plates in various grades and dimensions",
      link: "/products#sheets"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-steel-dark">Our Product Range</h2>
        <p className="text-center text-steel mb-12 max-w-3xl mx-auto">
          We offer a comprehensive range of steel products to meet diverse industrial and construction needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-steel-dark">{category.name}</h3>
                <p className="text-steel mb-4">{category.description}</p>
                <Link 
                  to={category.link} 
                  className="inline-flex items-center text-blue hover:text-blue-dark font-medium"
                >
                  View Products <ExternalLink size={16} className="ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/products" 
            className="inline-block bg-blue text-white py-3 px-8 rounded-md hover:bg-blue-dark transition-colors font-medium"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;


import { Shield, Truck, Users } from "lucide-react";

const ValueProposition = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-steel-dark">Our Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Shield size={48} className="text-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-steel-dark">Quality Assured</h3>
            <p className="text-steel">
              We offer superior quality steel products that meet industry standards and specifications.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Users size={48} className="text-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-steel-dark">Customer First</h3>
            <p className="text-steel">
              We're committed to creating customers for life through trust, value, and excellent service.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Truck size={48} className="text-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-steel-dark">Reliable Delivery</h3>
            <p className="text-steel">
              Strategic location ensures timely delivery to industrial areas and construction sites.
            </p>
          </div>
        </div>
        
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg text-center text-steel">
            "Since inception, SS Steel India Corp has strived to offer superior quality products at the most affordable prices. 
            We're committed to creating customers for life through trust, value, and service."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;

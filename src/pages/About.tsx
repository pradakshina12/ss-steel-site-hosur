
import { Building, CheckCircle, Award } from "lucide-react";

const About = () => {
  return (
    <div>
      <div className="bg-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Us</h1>
          <p className="max-w-3xl mx-auto text-lg">
            Learn about our journey to becoming a leading steel supplier in Hosur
          </p>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-steel-dark">Our Story</h2>
              <p className="text-steel mb-4">
                Founded in 2015, SS Steel India Corporation is an energetic and dynamic company specializing in the retail 
                and wholesale of Iron and Steel Materials. Serving civil construction, local and industrial fabricators, 
                and heavy equipment manufacturers.
              </p>
              <p className="text-steel mb-4">
                Backed by over 20 years of experience from experts in the industry, we are on a journey to become the leading 
                supplier of steel materials in and around Hosur.
              </p>
              <p className="text-steel">
                Our strategic location on NH 7 - Hosur, just 40 KM from Bengaluru, provides easy access for loading 
                and delivery to nearby industrial areas and construction sites.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                alt="Steel Industry" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-steel-dark">Our Business Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <Building size={48} className="text-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-steel-dark">Strong Foundation</h3>
              <p className="text-steel text-center">
                We've built our business on a foundation of integrity, reliability, and professional expertise.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <CheckCircle size={48} className="text-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-steel-dark">Quality Commitment</h3>
              <p className="text-steel text-center">
                We are committed to providing only the highest quality steel products that meet or exceed industry standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <Award size={48} className="text-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-steel-dark">Customer First</h3>
              <p className="text-steel text-center">
                Our client-first motto ensures that we prioritize your needs and provide exceptional service every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Choose Us?</h2>
          <div className="max-w-3xl mx-auto">
            <p className="mb-4">
              Since inception, SS Steel India Corp has strived to offer superior quality products at the most affordable prices. 
              We're committed to creating customers for life through trust, value, and service.
            </p>
            <p>
              With our extensive inventory and industry expertise, we ensure that your steel requirements are met with precision, 
              quality, and timeliness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

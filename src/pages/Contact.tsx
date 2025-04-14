
import GoogleMap from "@/components/GoogleMap";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div>
      <div className="bg-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="max-w-3xl mx-auto text-lg">
            Get in touch with us for all your steel requirements
          </p>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-steel-dark">Our Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin size={24} className="text-blue mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-steel-dark">Address</h3>
                    <p className="text-steel">
                      SS Steel India Corporation<br />
                      756/6-B, Opp Anand Electronics, Krishnagiri Main Road,<br />
                      Hosur, Tamil Nadu – 635109
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={24} className="text-blue mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-steel-dark">Phone</h3>
                    <p className="text-steel">+91 63820 85337</p>
                    <p className="text-steel">+91 87540 10925</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail size={24} className="text-blue mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-steel-dark">Email</h3>
                    <p className="text-steel">sales@sssteelindia.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={24} className="text-blue mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-steel-dark">Business Hours</h3>
                    <p className="text-steel">Monday to Saturday: 9:00 AM – 7:00 PM</p>
                    <p className="text-steel">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-steel-dark">Our Location</h2>
              <GoogleMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

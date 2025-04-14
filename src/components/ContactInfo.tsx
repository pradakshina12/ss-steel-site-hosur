
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="bg-steel-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <MapPin size={32} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Our Location</h3>
            <p>
              756/6-B, Opp Anand Electronics, Krishnagiri Main Road,
              Hosur, Tamil Nadu – 635109
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Phone size={32} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Phone Numbers</h3>
            <p>+91 63820 85337</p>
            <p>+91 87540 10925</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Mail size={32} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Email Address</h3>
            <p>sales@sssteelindia.com</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Clock size={32} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Business Hours</h3>
            <p>Monday to Saturday</p>
            <p>9:00 AM - 7:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;

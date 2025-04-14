
import EnquiryForm from "@/components/EnquiryForm";

const Enquiry = () => {
  return (
    <div>
      <div className="bg-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Make an Enquiry</h1>
          <p className="max-w-3xl mx-auto text-lg">
            We're ready to meet your steel requirements. Drop us a message!
          </p>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-steel-dark">Enquiry Form</h2>
            <EnquiryForm />
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4 text-steel-dark">Prefer to call?</h3>
            <p className="text-steel mb-2">+91 63820 85337</p>
            <p className="text-steel">+91 87540 10925</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;


const GoogleMap = () => {
  return (
    <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.8264341542604!2d77.81710261482118!3d12.844072590940193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae70fa84554e75%3A0x5ae9f92433ae5c5!2sKrishnagiri%20Main%20Rd%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1649928181649!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="SS Steel India Corporation Location"
      />
    </div>
  );
};

export default GoogleMap;

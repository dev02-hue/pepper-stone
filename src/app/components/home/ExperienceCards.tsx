import { FaGlobe, FaBitcoin, FaCogs, FaFileAlt, FaLock, FaWallet } from 'react-icons/fa';

const ExperienceCards = () => {
  const features = [
    {
      icon: <FaGlobe className="text-blue-500" size={24} />,
      title: "Global Reach",
      description: "International client base across multiple continents with localized support.",
      accentColor: "bg-blue-100"
    },
    {
      icon: <FaBitcoin className="text-amber-500" size={24} />,
      title: "Crypto Solutions",
      description: "Full cryptocurrency support with secure trading and investment tools.",
      accentColor: "bg-amber-100"
    },
    {
      icon: <FaCogs className="text-emerald-500" size={24} />,
      title: "Reliable Infrastructure",
      description: "99.9% uptime with enterprise-grade reliability and performance.",
      accentColor: "bg-emerald-100"
    },
    {
      icon: <FaFileAlt className="text-purple-500" size={24} />,
      title: "Certified Compliance",
      description: "Fully licensed and regulated in all operational jurisdictions.",
      accentColor: "bg-purple-100"
    },
    {
      icon: <FaLock className="text-red-500" size={24} />,
      title: "Bank-Grade Security",
      description: "Military-grade encryption and multi-factor authentication.",
      accentColor: "bg-red-100"
    },
    {
      icon: <FaWallet className="text-cyan-500" size={24} />,
      title: "Profit Focused",
      description: "Data-driven investment strategies to maximize your returns.",
      accentColor: "bg-cyan-100"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Competitive Advantages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of clients worldwide for our exceptional service and results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${feature.accentColor}`}></div>
              
              <div className="p-6">
                <div className={`w-12 h-12 ${feature.accentColor} rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                <div className="mt-6">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceCards;
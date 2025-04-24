import { FaGlobe, FaBitcoin, FaCogs, FaFileAlt, FaLock, FaWallet } from 'react-icons/fa';

const experiences = [
  {
    icon: <FaGlobe size={30} />,
    title: 'Global',
    description: 'We are an international company having client from different countries around the world.',
  },
  {
    icon: <FaBitcoin size={30} />,
    title: 'Crypto',
    description: 'Our platform supports all types of cryptocurrency having an easy investment system.',
  },
  {
    icon: <FaCogs size={30} />,
    title: 'Reliable',
    description: 'We are very reliable as a huge number of people trust us. We conduct safe and secure services.',
  },
  {
    icon: <FaFileAlt size={30} />,
    title: 'Certified',
    description: 'We are a certified company doing legal business in the legal field. We operate international business.',
  },
  {
    icon: <FaLock size={30} />,
    title: 'Secure',
    description: 'We constantly work on improving our system and level of our security to minimize any potential risks.',
  },
  {
    icon: <FaWallet size={30} />,
    title: 'Profitable',
    description: 'Our professional traders will utilize your money making sure to get a good profit for you.',
  },
];

const ExperienceCards = () => {
  return (
    <section className="px-4 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-36">
        {[0, 1].map((sectionIndex) => (
          <div
            key={sectionIndex}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {experiences.slice(sectionIndex * 3, sectionIndex * 3 + 3).map((exp, index) => (
              <div key={index} className="relative bg-[#FD4A36] hover:bg-[#7C352D] rounded-xl p-6 min-h-[300px]">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white rounded-md shadow-lg p-6 w-[90%]  text-center">
                  <div className="text-black mb-2">{exp.icon}</div>
                  <h4 className="text-red-500 font-bold text-lg mb-2">{exp.title}</h4>
                  <p className="text-gray-600 text-sm border-t border-dashed pt-2">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceCards;

import { FaPaperPlane, FaIdCard, FaImage, FaSync } from "react-icons/fa";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export default function GetProfit() {
  return (
    <section
      className={`${inter.className} relative min-h-[60vh] bg-gradient-to-b from-purple-900 to-orange-400 flex items-center w-full px-4 sm:px-6 lg:px-10 py-10 mt-20`}
    >
      <div className="w-full lg:max-w-[70%] mx-auto  rounded-xl p-4 sm:p-6 lg:p-10">
        {/* Heading Section */}
        <div className="text-left  rounded-md p-4 mb-10">
          <h3 className="font-bold text-lg sm:text-xl text-[#FF6347] border-l-4 pl-2 border-[#FF6347] mb-2">
            How To Get Profit.
          </h3>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-snug">
            We utilize your money and <br />
            provide a source of high <br />
            income.
          </h1>
          <div className="w-12 h-1 bg-blue-600 mt-4"></div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 text-center rounded-md p-4">
          {[
            { icon: <FaPaperPlane />, label: "Make Plan" },
            { icon: <FaIdCard />, label: "Create Account" },
            { icon: <FaImage />, label: "Choose Plan" },
            { icon: <FaSync />, label: "Get Profit" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-black text-xl sm:text-2xl lg:text-3xl">
                {item.icon}
              </div>
              <p className="mt-2 text-xs sm:text-sm lg:text-base font-bold text-gray-900">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

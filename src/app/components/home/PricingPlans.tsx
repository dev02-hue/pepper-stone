import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'],  
    display: 'swap',
  });

export default function PricingPlans() {
  return (
    <section className={`${inter.className} py-20 px-4 sm:px-6 lg:px-10 bg-white`}>
      {/* Title Section */}
      <div className="mb-16 sm:pl-10 lg:pl-20">
        <h3 className="text-[#FF6347] font-bold text-base sm:text-lg md:text-xl lg:text-2xl border-l-4 border-[#FF6347] pl-3 inline-block">
          TTRADECAPITAL INVESTMENT PLANS
        </h3>
        <h1 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-snug sm:leading-tight">
          Take a look at our best investment plans where you will get the
          <br className="hidden sm:block" />
          best profits.
        </h1>
        <div className="w-12 h-1 bg-blue-600 mt-6 mx-auto"></div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
        {/* Pricing Cards */}
        {[
          {
            title: "Bronze Plan",
            percent: "400 %",
            duration: "For 24 Hours / 1 Returns",
            range: "Min. $300 Max: $999",
            colors: "from-pink-300 to-yellow-300",
          },
          {
            title: "Silver Plan",
            percent: "500 %",
            duration: "For 24 Hours / 1 Returns",
            range: "Min. $1000 Max: $4999",
            colors: "from-indigo-400 to-green-300",
          },
          {
            title: "Gold Plan",
            percent: "550 %",
            duration: "For 48 Hours / 1 Returns",
            range: "Min. $5000 Max: $100000",
            colors: "from-yellow-400 to-pink-500",
          },
        ].map((plan, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${plan.colors} text-white rounded-2xl p-6 w-full max-w-[320px] text-center shadow-xl hover:scale-105 transition duration-300`}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {plan.title}
            </h2>
            <p className="text-4xl sm:text-[52px] font-extrabold mt-2">
              {plan.percent}
            </p>
            <p className="text-sm sm:text-base font-medium mb-3">
              {plan.duration}
            </p>
            <div className="bg-green-600 text-white text-xs font-bold py-1 mt-5 mb-8 px-2 rounded inline-block">
              Capital Will Return Back
            </div>
            <p className="text-sm mb-3 font-medium">24/7 Support</p>
            <p className="text-sm mb-3 font-medium">10% Referral Commission</p>
            <p className="text-sm mb-4">{plan.range}</p>
            <button className="bg-white text-black px-6 sm:px-8 py-2 mt-5 rounded-full font-semibold shadow hover:scale-105 transition">
              Invest Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

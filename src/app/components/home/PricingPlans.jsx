export default function PricingPlans() {
  return (
    <section className="py-20 px-5 bg-white">
      {/* Title Section */}
      <div className="mb-16 pl-20">
        <h3 className="text-[#FF6347] font-bold text-[24px] border-l-4 border-[#FF6347] pl-3 inline-block">
          Bitci Stack Asset BSA Investment Plans
        </h3>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          Take a look at our best investment plans where you will get the
          <br className="hidden sm:block" />
          best profits.
        </h1>
        <div className="w-12 h-1 bg-blue-600 mt-6 mx-auto"></div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {/* Bronze Plan */}
        <div className="bg-gradient-to-br from-pink-300 to-yellow-300 text-white rounded-2xl p-6 w-80 text-center shadow-xl hover:scale-110 transition duration-300">
          <h2 className="text-[32px] font-extrabold">Bronze Plan</h2>
          <p className="text-[62px] font-extrabold">3.5 %</p>
          <p className="text-[16px] mb-3 font-medium">
            For 24 Hours / 1 Returns
          </p>
          <div className="bg-green-600 text-white text-xs font-bold py-1 mt-5 mb-8 px-2 rounded inline-block">
            Capital Will Return Back
          </div>
          <p className="text-sm mb-5 font-medium">24/7 Support</p>
          <p className="text-sm mb-5 font-medium">10% referral Commission</p>
          <p className="text-sm mb-4">Min. $50 Max: $999</p>
          <button className="bg-white text-black px-8 mt-7 py-2 rounded-full font-semibold shadow hover:scale-105 transition">
            Invest Now
          </button>
        </div>

        {/* Silver Plan */}
        <div className="bg-gradient-to-br from-indigo-400 to-green-300 text-white rounded-2xl p-6 w-80 text-center shadow-xl hover:scale-110 transition duration-300">
          <h2 className="text-[32px] font-extrabold">Silver Plan</h2>
          <p className="text-[62px] font-extrabold">5 %</p>
          <p className="text-[16px] mb-3 font-medium">
            For 24 Hours / 1 Returns
          </p>
          <div className="bg-green-600 text-white text-xs font-bold py-1 mt-5 mb-8 px-2 rounded inline-block">
            Capital Will Return Back
          </div>
          <p className="text-sm mb-5 font-medium">24/7 Support</p>
          <p className="text-sm mb-5 font-medium">10% referral Commission</p>
          <p className="text-sm mb-4">Min. $1000 Max: $4999</p>
          <button className="bg-white text-black px-8 mt-7 py-2 rounded-full font-semibold shadow hover:scale-105 transition">
            Invest Now
          </button>
        </div>

        {/* Gold Plan */}
        <div className="bg-gradient-to-br from-yellow-400 to-pink-500 text-white rounded-2xl p-6 w-80 text-center shadow-xl hover:scale-110 transition duration-300">
          <h2 className="text-[32px] font-extrabold">Gold Plan</h2>
          <p className="text-[62px] font-extrabold">10 %</p>
          <p className="text-[16px] mb-3 font-medium">
            For 48 Hours / 1 Returns
          </p>
          <div className="bg-green-600 text-white text-xs font-bold py-1 mt-5 mb-8 px-2 rounded inline-block">
            Capital Will Return Back
          </div>
          <p className="text-sm mb-5 font-medium">24/7 Support</p>
          <p className="text-sm mb-5 font-medium">10% referral Commission</p>
          <p className="text-sm mb-4">Min. $5000 Max: $100000</p>
          <button className="bg-white text-black px-8 mt-7 py-2 rounded-full font-semibold shadow hover:scale-105 transition">
            Invest Now
          </button>
        </div>
      </div>
    </section>
  );
}

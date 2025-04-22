import { FaPaperPlane, FaIdCard, FaImage, FaSync } from "react-icons/fa";

export default function GetProfit() {
  return (
    <section
      className="relative min-h-[90vh] bg-gradient-to-b mt-24 from-purple-900 to-orange-400 
                 px-8 pt-32 pb-24"
    >
      <div className="max-w-3xl">
        <div className="pl-14">
          <h3
            className="font-bold text-lg text-[#FF6347] border-l-4 border-[#FF6347] 
                       pl-3"
          >
            How To Get Profit.
          </h3>

          <h1
            className="mt-4 text-4xl sm:text-4xl font-extrabold text-gray-900 
                       leading-tight"
          >
            We utilize your money and
            <br />
            provide a source of high
            <br />
            income.
          </h1>

          <div className="w-12 h-1 bg-blue-600 mt-20 ml-52"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 mt-20 text-center ">
          <div className="flex flex-col items-center">
            <FaPaperPlane className="w-6 h-6 text-black" />
            <p className="mt-2 text-sm font-bold text-gray-900">
              Make Plan
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaIdCard className="w-6 h-6 text-black" />
            <p className="mt-2 text-sm font-bold text-gray-900">
              Create Account
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaImage className="w-6 h-6 text-black" />
            <p className="mt-2 text-sm font-bold text-gray-900">
              Choose Plan
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaSync className="w-6 h-6 text-black" />
            <p className="mt-2 text-sm font-bold text-gray-900">
              Get Profit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

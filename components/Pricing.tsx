import React from 'react';
import { Gift, Bot, TrendingUp, Percent, PawPrint, Bone, Users } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <PawPrint className="absolute text-9xl top-10 left-10 transform -rotate-12 w-64 h-64 text-gray-600" />
        <Bone className="absolute text-9xl bottom-10 right-10 transform rotate-45 w-64 h-64 text-gray-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-400 mb-16 text-lg">No hidden fees. Cancel anytime. One plan for total protection.</p>

        <div className="max-w-md mx-auto bg-white text-gray-800 rounded-[2rem] p-8 lg:p-10 shadow-2xl relative transform transition hover:scale-105 duration-300 ring-4 ring-pawly-orange/50">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pawly-orange text-white px-6 py-2 rounded-full font-bold shadow-lg uppercase tracking-wide text-sm">
            Most Popular
          </div>
          
          <h3 className="text-2xl font-bold mb-2 font-heading">Pawly Guardian Plan</h3>
          <div className="flex justify-center items-baseline my-6">
            <span className="text-5xl font-extrabold tracking-tight text-gray-900">$9.90</span>
            <span className="text-xl text-gray-500 ml-1 font-semibold">/mo</span>
          </div>
          <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">Less than the cost of a coffee a week.</p>

          <ul className="space-y-5 text-left mb-10">
            <li className="flex items-center">
              <Bot className="text-green-500 mr-3 w-5 h-5 flex-shrink-0" />
              <span className="font-bold text-gray-800">Unlimited 24/7 AI Vet Chat</span>
            </li>
            <li className="flex items-center">
              <Users className="text-pawly-orange mr-3 w-5 h-5 flex-shrink-0" />
              <span className="text-gray-600">Unlimited Pet Profiles</span>
            </li>
            <li className="flex items-center">
              <TrendingUp className="text-blue-500 mr-3 w-5 h-5 flex-shrink-0" />
              <span className="text-gray-600">Weekly Health Insight Reports</span>
            </li>
            <li className="flex items-center">
              <Percent className="text-red-500 mr-3 w-5 h-5 flex-shrink-0" />
              <span className="text-gray-600">Exclusive Discounts on Pet Food</span>
            </li>
          </ul>

          <button className="w-full bg-pawly-dark text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-xl transform active:scale-95 duration-150">
            Join Pawly Now
          </button>
          <p className="text-xs text-gray-400 mt-4">30-day money-back guarantee.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
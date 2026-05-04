import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-12 relative group">
          <div className="absolute inset-0 bg-pawly-orange rounded-3xl transform rotate-3 scale-95 opacity-20 group-hover:rotate-6 transition duration-500"></div>
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Pet Hug" 
            className="rounded-3xl shadow-2xl relative z-10 transform transition duration-500 hover:scale-[1.01]" 
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-gray-900">
            More Than Just Tech.<br />
            It's <span className="text-pawly-orange">Peace of Mind.</span>
          </h2>
          
          <div className="space-y-8">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="text-pawly-orange w-6 h-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-800">Proactive, Not Reactive</h4>
                <p className="text-gray-500 leading-relaxed mt-1">We don't wait for your pet to get sick. Our AI helps you notice subtle changes early, so you can act with confidence before anything escalates.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="text-pawly-orange w-6 h-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-800">Data Driven, Love Powered</h4>
                <p className="text-gray-500 leading-relaxed mt-1">We bring together health expertise and genuine warmth — because we know they're family, not just animals.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="text-pawly-orange w-6 h-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-800">Accessible to All</h4>
                <p className="text-gray-500 leading-relaxed mt-1">Peace of mind shouldn't cost a fortune. We make premium health guidance affordable for every pet parent.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
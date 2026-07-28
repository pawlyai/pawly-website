import React from 'react';
import { Stethoscope, PlayCircle, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        {/* Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 z-10">
          <div className="inline-block bg-orange-100 text-pawly-orange px-4 py-1.5 rounded-full font-bold text-sm mb-6 animate-pulse">
            🐾 Pet care guidance, powered by AI
          </div>
          <h1 className="text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-6 text-gray-900">
            Healthier Pets<br />
            <span className="text-pawly-orange">Happier Tails</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Toki Tail is the 24/7 AI care companion that truly knows your pet — their breed, their history, their little quirks. Ask anything, anytime, and get vet-informed guidance made just for them.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a 
              href="#demo"
              className="bg-pawly-orange text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-orange-500 transition flex items-center justify-center transform hover:scale-105 active:scale-95 duration-200"
            >
              <Stethoscope className="mr-2 w-5 h-5" /> Try Free Check
            </a>
            <a href="#product" className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:border-pawly-orange hover:text-pawly-orange transition flex items-center justify-center transform hover:scale-105 active:scale-95 duration-200">
              <PlayCircle className="mr-2 w-5 h-5" /> See How it Works
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400 flex items-center justify-center lg:justify-start">
             <span className="flex -space-x-2 mr-2">
                 <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1517423568366-eb51fb5984db?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                 <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                 <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
             </span>
             Join pet parents who care • Available 24/7
          </p>
        </div>

        {/* Image Content */}
        <div className="lg:w-1/2 relative z-0 w-full">
          {/* Animated Background Blobs */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="relative animate-fade-in">
            <img
              src="/hero.png"
              alt="Happy Dog and Cat"
              className="relative rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 w-full object-cover h-[500px]"
            />
            {/* Floating Data Card */}
            <div className="absolute bottom-10 -left-4 sm:-left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center animate-bounce duration-[3000ms] border border-gray-100 max-w-[240px]">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                <CheckCircle className="text-pawly-green w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Analysis Status</p>
                <p className="font-bold text-gray-800 text-lg">Instant Reply ⚡</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
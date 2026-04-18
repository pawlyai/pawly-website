import React from 'react';
import { Clock, Stethoscope, FileText } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="product" className="py-20 bg-pawly-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Complete Care Circle</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">We don't just answer questions. We monitor, analyze, and guide.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-500 mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-center">24/7 Availability</h3>
            <p className="text-gray-500 leading-relaxed">
              Health concerns don't keep office hours. Whether it's 2 AM or 2 PM, our AI Care Assistant is instantly available to provide guidance and peace of mind.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition duration-300 border-2 border-pawly-orange relative transform hover:-translate-y-1 z-10">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pawly-orange text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-md tracking-wide">
              CORE TECHNOLOGY
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-pawly-orange mx-auto">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-center">AI Triage Assistant</h3>
            <p className="text-gray-500 leading-relaxed">
              Instant answers for "Is this an emergency?" We use evidence-based protocols (RAG) to analyze symptoms and give you a Red, Yellow, or Green light status.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-pawly-green mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-center">Monthly Health Report</h3>
            <p className="text-gray-500 leading-relaxed">
              Get a holistic view of your pet's wellness. We correlate diet, activity, and symptoms to recommend the best food and care products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
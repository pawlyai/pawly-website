import React from 'react';

const Mission: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-24">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
          We believe every pet deserves<br />a healthy, joyful life.
        </h1>
      </div>

      {/* First Full-width Image */}
      <div className="w-full h-[60vh] md:h-[80vh] mb-20">
        <img 
          src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1920&q=80" 
          alt="A warm moment with a pet" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Mission Text */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">Our Mission</h2>
        <div className="text-xl md:text-2xl text-gray-700 leading-relaxed space-y-6 font-light">
          <p>
            To create a trustworthy AI companion that supports pet families with professional guidance, gentle care, and scientific insight.
          </p>
          <p>
            We are committed to helping every pet parent make informed, confident, and compassionate decisions — so that every animal can be better cared for, raised more scientifically, and live a healthier life.
          </p>
          <p>
            This is not just a mission of technology — it's a promise of humanity to protect companion animals and honor our responsibility to the natural world.
          </p>
        </div>
      </div>

      {/* Second Full-width Image */}
      <div className="w-full h-[60vh] md:h-[80vh] mb-24">
        <img 
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1920&q=80" 
          alt="Happy dogs running" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Vision */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">Our Vision</h2>
        <div className="text-xl md:text-2xl text-gray-700 leading-relaxed space-y-6 font-light">
          <p>
            To build a compassionate and intelligent care system where every companion animal — no matter their age, breed, or background — receives dignified, continuous, and accessible support.
          </p>
          <p>
            We look beyond immediate issues. We care about a pet's daily nutrition, movement, emotions, and routines. We believe scientific understanding and continuous observation are the foundation of true love and care.
          </p>
          <p>
            We dream of building a globally accessible, dignified, and empathetic support system — so that no pet is ever alone in facing health challenges, and every animal can grow with joy, wellness, and love.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8 text-center">Our Values</h2>
        <div className="text-xl md:text-2xl text-gray-700 leading-relaxed space-y-10 font-light">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Compassion First</h3>
            <p>We serve animals with empathy, and every decision starts with respect for life.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Scientific Rigor</h3>
            <p>We collaborate with pet care professionals and follow evidence-based logic, not trends.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Transparency & Trust</h3>
            <p>We disclose AI's boundaries and honor your data rights.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Equity in Access</h3>
            <p>We believe every pet deserves care, no matter where they are.</p>
          </div>
        </div>
      </div>

      {/* Third Full-width Image (Team Spirit) */}
      <div className="w-full h-[60vh] md:h-[80vh] mb-24">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80" 
          alt="Team putting hands together in sunshine" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Who we are */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <div className="border-t border-gray-200 pt-24">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">Who we are</h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
            The Singapore-based founding team — holds advanced degrees from NTU and the Central Academy of Fine Arts, with expertise in autonomous driving AI, data infrastructure, e-commerce, and digital advertising. Beyond technical credentials, the founders are active pet owners and long-term rescue community organisers — bringing authentic domain knowledge to a market no mature vertical AI has yet fully addressed.
          </p>
        </div>
      </div>

      {/* Contact Us */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">Have questions?</h2>
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
          Please send an email to <br className="md:hidden" />
          <a href="mailto:contact@pawlyai.com" className="text-pawly-orange hover:underline font-semibold">contact@pawlyai.com</a>
        </p>
      </div>
    </div>
  );
};

export default Mission;

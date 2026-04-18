import React, { useState, useEffect } from 'react';
import { Bot, Send, MapPin, Calendar } from 'lucide-react';

const DemoChat: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scenarios = [
    // Scenario 1: Triage
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scroll-hidden space-y-4 flex flex-col">
      <div className="chat-bubble bg-pawly-orange text-white ml-auto rounded-2xl rounded-br-none max-w-[85%] px-4 py-3 text-[0.95rem] shadow-sm">
        My dog vomited this morning 🤮
      </div>
      <div className="chat-bubble bg-white text-gray-700 mr-auto rounded-2xl rounded-bl-none border border-gray-100 max-w-[85%] px-4 py-3 text-[0.95rem] shadow-sm">
        I see. 🤢 <strong>Vomiting</strong> can be tricky.<br/><br/>Checking my wellness database... vomiting can be caused by many factors including diet or minor issues.<br/><br/>What color was the vomit?
      </div>
      <div className="chat-bubble bg-pawly-orange text-white ml-auto rounded-2xl rounded-br-none max-w-[85%] px-4 py-3 text-[0.95rem] shadow-sm">
        It looks like yellow bile.
      </div>
      <div className="chat-bubble bg-white text-gray-700 mr-auto rounded-2xl rounded-bl-none border border-gray-100 max-w-[85%] px-4 py-3 text-[0.95rem] shadow-sm">
        ✅ <strong>Green/Yellow Light:</strong><br/>Yellow bile often means an empty stomach. Let's try a <strong>12-hour fast</strong> and small amounts of water.<br/><br/>Monitor his condition closely tonight. If he vomits again, please seek professional care.
      </div>
    </div>,

    // Scenario 2: Emergency
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scroll-hidden space-y-4 flex flex-col">
      <div className="chat-bubble bg-pawly-orange text-white ml-auto rounded-2xl rounded-br-none max-w-[85%] px-4 py-3 text-[0.95rem] shadow-sm">
        He just ate a whole bar of dark chocolate! 🍫
      </div>
      <div className="chat-bubble bg-red-50 text-red-800 mr-auto rounded-2xl rounded-bl-none border border-red-200 max-w-[90%] px-4 py-3 text-[0.95rem] shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        🔴 <strong>EMERGENCY WARNING</strong><br/><br/>
        Your pet must go to an emergency care center <strong>immediately</strong>. I have recommended a 24/7 care facility within 3km of your home.<br/><br/>
        Please don't panic, I will be right here with you to take care of your baby.
      </div>
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center space-x-3 mt-2">
        <div className="bg-red-100 p-2 rounded-lg text-red-600 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-800">City Pet Emergency Center</p>
          <p className="text-xs text-gray-500">2.1 km away • Open 24/7</p>
        </div>
      </div>
    </div>,

    // Scenario 3: Reminder
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scroll-hidden space-y-4 flex flex-col justify-center">
      <div className="chat-bubble bg-blue-50 text-blue-800 mx-auto rounded-2xl border border-blue-200 max-w-[90%] px-4 py-4 text-[0.95rem] shadow-md relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
        <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <strong>Upcoming Appointment</strong><br/><br/>
        Tomorrow at 3:30 PM is your scheduled appointment for your baby's vaccination.<br/><br/>
        Don't forget to bring the health booklet! 🐾
      </div>
    </div>
  ];

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % scenarios.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, scenarios.length]);

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Chat with Pawly AI 🩺</h2>
          <p className="text-gray-600">Experience our AI capabilities. See how Pawly handles triage, emergencies, and reminders.</p>
        </div>

        {/* Mobile Frame */}
        <div 
          className="bg-gray-100 rounded-[3rem] p-3 sm:p-4 max-w-sm mx-auto shadow-2xl border-8 border-gray-800 relative overflow-hidden ring-4 ring-gray-200"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
          
          {/* Screen */}
          <div className="bg-white rounded-[2rem] h-[550px] flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 pt-10 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-pawly-orange flex items-center justify-center text-white mr-3 shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Pawly Guardian</h4>
                  <span className="text-xs text-pawly-green font-semibold flex items-center">
                    <span className="w-2 h-2 bg-pawly-green rounded-full mr-1 animate-pulse"></span>
                    Online & Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Carousel Content */}
            <div className="flex-1 relative overflow-hidden bg-gray-50">
              {scenarios.map((scenario, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out flex flex-col ${
                    idx === currentIndex ? 'translate-x-0' : idx < currentIndex ? '-translate-x-full' : 'translate-x-full'
                  }`}
                >
                  {scenario}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white relative z-10">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  disabled 
                  className="w-full bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-none cursor-not-allowed text-gray-500"
                />
                <button className="absolute right-2 top-1.5 w-8 h-8 bg-pawly-orange rounded-full text-white flex items-center justify-center text-xs shadow-md">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-[80px] left-0 right-0 flex justify-center space-x-2 z-20">
              {scenarios.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-pawly-orange w-4' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoChat;
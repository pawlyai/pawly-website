import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import { Message } from '../types';

const INITIAL_MESSAGE: Message = {
  id: '1',
  sender: 'ai',
  text: <span dangerouslySetInnerHTML={{ __html: "Hi there! I'm Pawly. 🐾 <br/>I'm your AI veterinary assistant. <br/> How can I help you today?" }} />,
  timestamp: Date.now(),
};

const DemoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showFollowUpOptions, setShowFollowUpOptions] = useState<'vomit' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showFollowUpOptions]);

  const handleUserSelection = (scenario: 'vomit' | 'scratch') => {
    setShowQuickReplies(false);
    
    const userText = scenario === 'vomit' ? 'My dog vomited 🤮' : 'He is scratching ear 👂';
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate typing delay
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let aiText = '';
      if (scenario === 'vomit') {
        aiText = "I see. 🤢 <strong>Vomiting</strong> can be tricky.<br/><br/>Checking my medical database... vomiting can be caused by many factors including diet or illness.<br/><br/>What color was the vomit?";
        setShowFollowUpOptions('vomit');
      } else {
        aiText = "Got it. 👂 <strong>Scratching ears</strong> usually means irritation or mites.<br/><br/>If they are shaking their head frequently, it often confirms discomfort.<br/><br/>Is the ear red or smelly?";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: <span dangerouslySetInnerHTML={{ __html: aiText }} />,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const handleFollowUpSelection = (type: 'yellow' | 'red') => {
    setShowFollowUpOptions(null);
    const userText = type === 'yellow' ? 'It looks like yellow bile.' : 'There is blood.';
    
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let aiText = '';
      if (type === 'yellow') {
        aiText = "✅ <strong>Green/Yellow Light:</strong><br/>Yellow bile often means an empty stomach. Let's try a <strong>12-hour fast</strong> and small amounts of water.<br/><br/>Monitor his condition closely tonight. If he vomits again, we go to the vet.";
      } else {
        aiText = "🔴 <strong>Red Light Warning:</strong><br/>Blood in vomit is serious. Please go to the <strong>Emergency Vet</strong> immediately.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: <span dangerouslySetInnerHTML={{ __html: aiText }} />,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Chat with Pawly AI 🩺</h2>
          <p className="text-gray-600">Experience our Triage System. Try telling Pawly: <strong>"My dog vomited this morning."</strong></p>
        </div>

        {/* Mobile Frame */}
        <div className="bg-gray-100 rounded-[3rem] p-3 sm:p-4 max-w-sm mx-auto shadow-2xl border-8 border-gray-800 relative overflow-hidden ring-4 ring-gray-200">
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

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50 scroll-hidden space-y-4"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`chat-bubble relative max-w-[85%] px-4 py-3 rounded-2xl text-[0.95rem] leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-pawly-orange text-white ml-auto rounded-br-none' 
                      : 'bg-white text-gray-700 mr-auto rounded-bl-none border border-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="chat-bubble bg-white text-gray-700 mr-auto rounded-bl-none border border-gray-100 w-16 flex items-center justify-center space-x-1 py-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_both] delay-[-0.32s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_both] delay-[-0.16s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_both]"></div>
                </div>
              )}
              
              {showFollowUpOptions === 'vomit' && !isTyping && (
                <div className="flex space-x-2 mt-2 justify-start animate-fade-in">
                  <button 
                    onClick={() => handleFollowUpSelection('yellow')} 
                    className="bg-yellow-50 text-yellow-700 text-xs px-4 py-2 rounded-full border border-yellow-200 hover:bg-yellow-100 transition font-semibold"
                  >
                    Yellow bile
                  </button>
                  <button 
                    onClick={() => handleFollowUpSelection('red')} 
                    className="bg-red-50 text-red-700 text-xs px-4 py-2 rounded-full border border-red-200 hover:bg-red-100 transition font-semibold"
                  >
                    Red / Blood
                  </button>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              {showQuickReplies && (
                <div className="flex space-x-2 mb-3 overflow-x-auto scroll-hidden">
                  <button onClick={() => handleUserSelection('vomit')} className="bg-gray-100 text-xs px-4 py-2 rounded-full hover:bg-gray-200 transition text-gray-700 whitespace-nowrap font-medium">
                    My dog vomited 🤮
                  </button>
                  <button onClick={() => handleUserSelection('scratch')} className="bg-gray-100 text-xs px-4 py-2 rounded-full hover:bg-gray-200 transition text-gray-700 whitespace-nowrap font-medium">
                    Scratching ear 👂
                  </button>
                </div>
              )}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a symptom..." 
                  disabled 
                  className="w-full bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-none cursor-not-allowed text-gray-500"
                />
                <button className="absolute right-2 top-1.5 w-8 h-8 bg-pawly-orange rounded-full text-white flex items-center justify-center text-xs hover:bg-orange-500 transition shadow-md">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoChat;
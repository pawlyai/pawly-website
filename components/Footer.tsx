import React from 'react';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-6">
          <Logo className="w-6 h-6 mr-2" />
          <span className="font-heading font-bold text-xl text-gray-800">
            Pawly<span className="text-pawly-orange">AI</span>
          </span>
        </div>
        
        <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-pawly-orange transition"><Twitter className="w-5 h-5"/></a>
            <a href="#" className="text-gray-400 hover:text-pawly-orange transition"><Instagram className="w-5 h-5"/></a>
            <a href="#" className="text-gray-400 hover:text-pawly-orange transition"><Facebook className="w-5 h-5"/></a>
        </div>

        <p className="text-sm text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
          Disclaimer: Pawly AI is an information and triage tool, not a replacement for professional veterinary diagnosis. In a medical emergency, always contact your local veterinarian immediately.
        </p>
        <p className="text-sm text-gray-400">© 2024 Pawly AI Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

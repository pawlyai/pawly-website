import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import Logo from './Logo';

const RedditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.07 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-6">
          <Logo className="w-6 h-6 mr-2" />
          <span className="font-heading font-bold text-xl text-gray-800">
            Toki Tail
          </span>
        </div>

        <div className="flex justify-center space-x-6 mb-8">
            <a href="https://www.reddit.com/u/APawly/s/8gFYnTofTd" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="text-gray-400 hover:text-pawly-orange transition"><RedditIcon className="w-5 h-5"/></a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pawly-orange transition"><Instagram className="w-5 h-5"/></a>
            <a href="https://www.facebook.com/share/18YwpYoEzp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-pawly-orange transition"><Facebook className="w-5 h-5"/></a>
        </div>

        <p className="text-sm text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
          Disclaimer: Toki Tail is an information and triage tool, not a replacement for professional veterinary diagnosis. In a medical emergency, always contact your local veterinarian immediately.
        </p>
        <p className="text-sm text-gray-400">© 2026 Toki Tail Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

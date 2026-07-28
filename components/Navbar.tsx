import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHashLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace('/#', '');
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'How it Works', href: '/#product' },
    { name: 'Try Demo', href: '/#demo' },
    { name: 'Our Mission', href: '/#philosophy' },
    { name: 'About Us', href: '/mission' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center cursor-pointer">
            <Logo className="w-12 h-12 mr-2" />
            <span className="font-heading font-bold text-2xl tracking-tight text-gray-800">
              Toki Tail
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              link.href.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleHashLink(e, link.href)}
                  className="text-gray-600 hover:text-pawly-orange font-semibold transition text-sm lg:text-base cursor-pointer"
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-gray-600 hover:text-pawly-orange font-semibold transition text-sm lg:text-base"
                >
                  {link.name}
                </Link>
              )
            ))}
            <a 
              href="https://t.me/Pawlyai_com_bot" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pawly-dark text-white px-6 py-2.5 rounded-full font-bold hover:bg-gray-700 transition shadow-lg transform hover:-translate-y-0.5 text-sm lg:text-base"
            >
              Get Started
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-pawly-orange">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl absolute top-full left-0 w-full py-4 px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            link.href.startsWith('/#') ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleHashLink(e, link.href)}
                className="text-gray-600 hover:text-pawly-orange font-semibold block cursor-pointer"
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-gray-600 hover:text-pawly-orange font-semibold block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
          <a 
            href="https://t.me/Pawlyai_com_bot" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pawly-dark text-white px-6 py-3 rounded-full font-bold text-center block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

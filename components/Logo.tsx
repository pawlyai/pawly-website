import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  const [error, setError] = useState(false);

  if (error) {
    return <PawPrint className={`text-pawly-orange ${className}`} />;
  }

  return (
    <img 
      src="/logo.png" 
      alt="Toki Tail Logo"
      className={`object-contain ${className}`}
      onError={() => setError(true)}
    />
  );
};

export default Logo;

"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';

export default function SplashWrapper({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  // Only show splash screen on home page initial load
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setIsLoading(false);
    }
  }, [isHome]);

  return (
    <>
      {isLoading && isHome ? (
        <SplashScreen finishLoading={() => setIsLoading(false)} />
      ) : null}
      
      {/* Hide scrollbar while splash is active and hide floating contact */}
      <style jsx global>{`
        body {
          overflow: ${isLoading ? 'hidden' : 'auto'};
        }
        .floating-contact {
          opacity: ${isLoading && isHome ? '0' : '1'};
          pointer-events: ${isLoading && isHome ? 'none' : 'auto'};
          transition: opacity 0.5s ease;
        }
      `}</style>
      
      {children}
    </>
  );
}

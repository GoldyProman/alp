"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import AlpineLogo from './AlpineLogo';

export default function SplashScreen({ finishLoading }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Timeout to unmount the splash screen and trigger the main app reveal
    const timer = setTimeout(() => {
      setIsMounted(true);
      setTimeout(() => {
        finishLoading();
      }, 800); // Wait for exit animation to complete
    }, 1500); // How long the splash screen stays

    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <AnimatePresence>
      {!isMounted && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <AlpineLogo style={{ height: '220px', width: 'auto' }} />
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

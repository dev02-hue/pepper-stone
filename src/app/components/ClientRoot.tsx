
'use client';

import { useEffect } from 'react';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Clean up extension-added attributes
    const cleanupAttributes = () => {
      // Common extension attributes
      document.body.removeAttribute('cz-shortcut-listen');
      document.body.removeAttribute('grammarly-shadow-root');
      document.body.removeAttribute('data-gramm');
      
      // Add any other extension-specific attributes you encounter
    };

    // Initial cleanup
    cleanupAttributes();

    // Setup MutationObserver to catch future modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          cleanupAttributes();
        }
      });
    });

    observer.observe(document.body, { 
      attributes: true,
      attributeFilter: ['cz-shortcut-listen', 'grammarly-shadow-root', 'data-gramm']
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
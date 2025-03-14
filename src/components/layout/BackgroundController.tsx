'use client';

import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import ThreeBackground from './ThreeBackground';
import styles from './BackgroundController.module.css';

export type BackgroundType = 'particles' | 'three';

export default function BackgroundController() {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('particles');
  const [isControlVisible, setIsControlVisible] = useState(false);

  // Toggle background type
  const toggleBackground = () => {
    setBackgroundType(prev => prev === 'particles' ? 'three' : 'particles');
  };

  // Show/hide controls with keyboard shortcut (Alt+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'b') {
        setIsControlVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {backgroundType === 'particles' ? <ParticleBackground /> : <ThreeBackground />}
      
      {isControlVisible && (
        <div className={styles.controls}>
          <button 
            onClick={toggleBackground}
            className={styles.toggleButton}
            aria-label={`Switch to ${backgroundType === 'particles' ? 'three.js' : 'particles'} background`}
          >
            {backgroundType === 'particles' ? 'Switch to 3D Background' : 'Switch to Particle Background'}
          </button>
          <div className={styles.info}>
            Press Alt+B to toggle controls
          </div>
        </div>
      )}
    </>
  );
} 
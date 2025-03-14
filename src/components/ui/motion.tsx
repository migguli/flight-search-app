'use client';

import React, { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animate?: boolean;
  delay?: number;
  duration?: number;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' | 'bounce' | 'pulse' | 'shimmer' | 'flip' | 'float' | 'jello';
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
  infinite?: boolean;
}

export function Motion({
  children,
  animate = true,
  delay = 0,
  duration = 500,
  animationType = 'fade',
  intensity = 'normal',
  className = '',
  infinite = false,
  ...props
}: MotionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [animate, delay]);

  // Define intensity factors
  const getIntensityFactor = () => {
    switch (intensity) {
      case 'subtle': return 0.5;
      case 'normal': return 1;
      case 'strong': return 1.5;
      default: return 1;
    }
  };

  // Define animation styles with intensity
  const getAnimationStyles = () => {
    const factor = getIntensityFactor();
    const infiniteClass = infinite ? 'animate-infinite' : '';
    const baseStyles = `transition-all duration-${duration} ease-out ${infiniteClass}`;
    
    if (!isVisible) {
      switch (animationType) {
        case 'fade':
          return `${baseStyles} opacity-0`;
        case 'slide-up':
          return `${baseStyles} opacity-0 translate-y-${Math.round(8 * factor)}`;
        case 'slide-down':
          return `${baseStyles} opacity-0 -translate-y-${Math.round(8 * factor)}`;
        case 'slide-left':
          return `${baseStyles} opacity-0 translate-x-${Math.round(8 * factor)}`;
        case 'slide-right':
          return `${baseStyles} opacity-0 -translate-x-${Math.round(8 * factor)}`;
        case 'scale':
          return `${baseStyles} opacity-0 scale-${95 - Math.round(5 * factor)}`;
        case 'rotate':
          return `${baseStyles} opacity-0 rotate-${Math.round(15 * factor)}`;
        case 'bounce':
          return `${baseStyles} opacity-0 -translate-y-4 animate-bounce`;
        case 'pulse':
          return `${baseStyles} opacity-0 animate-pulse`;
        case 'shimmer':
          return `${baseStyles} opacity-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:400%_100%]`;
        case 'flip':
          return `${baseStyles} opacity-0 rotateX-${Math.round(90 * factor)}`;
        case 'float':
          return `${baseStyles} opacity-0 animate-float`;
        case 'jello':
          return `${baseStyles} opacity-0 animate-jello`;
        default:
          return `${baseStyles} opacity-0`;
      }
    }
    
    // Apply infinite animations when visible if specified
    if (isVisible && infinite) {
      switch (animationType) {
        case 'bounce':
          return `${baseStyles} animate-bounce`;
        case 'pulse':
          return `${baseStyles} animate-pulse`;
        case 'shimmer':
          return `${baseStyles} animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:400%_100%]`;
        case 'float':
          return `${baseStyles} animate-float`;
        case 'jello':
          return `${baseStyles} animate-jello`;
        default:
          return baseStyles;
      }
    }
    
    return baseStyles;
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationStyles()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
} 
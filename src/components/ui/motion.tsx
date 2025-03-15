'use client';

import React, { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animate?: boolean;
  delay?: number;
  duration?: number;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  className?: string;
}

export function Motion({
  children,
  animate = true,
  delay = 0,
  duration = 500,
  animationType = 'fade',
  className = '',
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

  // Define animation styles
  const getAnimationStyles = () => {
    const baseStyles = `transition-all duration-${duration} ease-out`;
    
    if (!isVisible) {
      switch (animationType) {
        case 'fade':
          return `${baseStyles} opacity-0`;
        case 'slide-up':
          return `${baseStyles} opacity-0 translate-y-8`;
        case 'slide-down':
          return `${baseStyles} opacity-0 -translate-y-8`;
        case 'slide-left':
          return `${baseStyles} opacity-0 translate-x-8`;
        case 'slide-right':
          return `${baseStyles} opacity-0 -translate-x-8`;
        case 'scale':
          return `${baseStyles} opacity-0 scale-95`;
        default:
          return `${baseStyles} opacity-0`;
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
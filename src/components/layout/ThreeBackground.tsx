'use client';

import { useEffect, useRef } from 'react';
import styles from './ThreeBackground.module.css';
// Import THREE dynamically to avoid SSR issues
import dynamic from 'next/dynamic';

// Create a simple loading placeholder
const LoadingPlaceholder = () => <div className={styles.container} aria-hidden="true" />;

// Dynamically import the actual component with no SSR
const ThreeBackgroundClient = dynamic(
  () => import('./ThreeBackgroundClient'),
  { ssr: false, loading: () => <LoadingPlaceholder /> }
);

export default function ThreeBackground() {
  return <ThreeBackgroundClient />;
} 
'use client';

import React from 'react';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:py-2 focus:px-4 focus:bg-primary-600 focus:text-white focus:rounded-md focus:outline-none focus:shadow-lg"
    >
      Skip to content
    </a>
  );
} 
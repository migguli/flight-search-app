'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ApiError } from '@/lib/api/config';

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  error?: ApiError | Error | null;
  resetError?: () => void;
}

/**
 * A component that displays API errors in a user-friendly way
 * It can be used in two ways:
 * 1. As a wrapper around components that might throw API errors (with try/catch)
 * 2. By passing an error prop directly
 */
export function ApiErrorBoundary({ 
  children, 
  fallback,
  error: propError, 
  resetError 
}: ApiErrorBoundaryProps) {
  const [error, setError] = useState<ApiError | Error | null>(propError || null);

  // Update error state when prop changes
  useEffect(() => {
    if (propError) {
      setError(propError);
    }
  }, [propError]);

  const handleReset = () => {
    setError(null);
    resetError?.();
  };

  if (error) {
    const isApiError = error instanceof ApiError;
    const status = isApiError ? error.status : 500;
    let title = 'Error';
    let description = error.message || 'Something went wrong. Please try again.';
    let variant: 'destructive' | 'warning' = 'destructive';

    // Customize based on status code for API errors
    if (isApiError) {
      if (status === 404) {
        title = 'Not Found';
        description = 'The requested resource could not be found.';
      } else if (status === 403) {
        title = 'Access Denied';
        description = 'You don\'t have permission to access this resource.';
      } else if (status === 401) {
        title = 'Authentication Required';
        description = 'Please log in to continue.';
      } else if (status >= 400 && status < 500) {
        title = 'Request Error';
        variant = 'warning';
      } else if (status >= 500) {
        title = 'Server Error';
      }
    }
    
    return fallback || (
      <div className="p-4 rounded-lg border border-neutral-200 bg-white shadow-sm">
        <Alert variant={variant} className="mb-4">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 
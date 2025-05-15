'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  getSessionId, 
  trackPageView, 
  trackAction, 
  trackSessionEnd,
  calculateTimeSpent
} from '@/lib/tracking';

// Define the context type
type TrackingContextType = {
  trackUserAction: (actionType: string, actionData?: any) => void;
};

// Create the context
const TrackingContext = createContext<TrackingContextType>({
  trackUserAction: () => {},
});

// Hook to use the tracking context
export const useTracking = () => useContext(TrackingContext);

// Tracking Provider component
export default function TrackingProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageLoadTime, setPageLoadTime] = useState<number>(Date.now());
  const [prevPathname, setPrevPathname] = useState<string | null>(null);

  // Track page view when pathname changes
  useEffect(() => {
    if (!pathname) return;

    // Calculate time spent on previous page
    if (prevPathname) {
      const timeSpent = calculateTimeSpent(pageLoadTime);
      
      // Track page view with duration for the previous page
      trackPageView(prevPathname, document.title);
    }

    // Reset page load time for the new page
    setPageLoadTime(Date.now());
    setPrevPathname(pathname);

    // Track initial page view for the new page
    trackPageView(pathname, document.title);
  }, [pathname, searchParams]);

  // Track session end when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = calculateTimeSpent(pageLoadTime);
      
      // Track the current page view with duration
      if (pathname) {
        trackPageView(pathname, document.title);
      }
      
      // Track session end
      trackSessionEnd();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, pageLoadTime]);

  // Function to track user actions
  const trackUserAction = (actionType: string, actionData?: any) => {
    if (!pathname) return;
    trackAction(actionType, pathname, actionData);
  };

  return (
    <TrackingContext.Provider value={{ trackUserAction }}>
      {children}
    </TrackingContext.Provider>
  );
}

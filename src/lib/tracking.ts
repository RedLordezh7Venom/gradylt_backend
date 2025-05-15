/**
 * Utility functions for user behavior tracking
 */

// Generate a unique session ID
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Get session ID from localStorage or create a new one
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
}

// Track page view
export async function trackPageView(path: string, title: string): Promise<void> {
  try {
    const sessionId = getSessionId();
    
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        eventType: 'pageView',
        path,
        title,
      }),
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

// Track user action
export async function trackAction(
  actionType: string, 
  path: string, 
  actionData?: any
): Promise<void> {
  try {
    const sessionId = getSessionId();
    
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        eventType: 'action',
        actionType,
        path,
        actionData,
      }),
    });
  } catch (error) {
    console.error('Error tracking action:', error);
  }
}

// Track session end
export async function trackSessionEnd(): Promise<void> {
  try {
    const sessionId = getSessionId();
    
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        eventType: 'sessionEnd',
      }),
    });
  } catch (error) {
    console.error('Error tracking session end:', error);
  }
}

// Calculate time spent on page
export function calculateTimeSpent(startTime: number): number {
  return Math.floor((Date.now() - startTime) / 1000);
}

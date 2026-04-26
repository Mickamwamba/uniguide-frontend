/**
 * Returns a globally unique session ID for the current user's browser session.
 * Stores in sessionStorage so it naturally resets when the user closes their browser completely.
 */
export const getTelemetrySessionId = () => {
  let sessionId = sessionStorage.getItem('telemetry_session_id');
  if (!sessionId) {
    // Rely on native browser Crypto API instead of forcing an npm install
    sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : 'session-' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('telemetry_session_id', sessionId);
  }
  return sessionId;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Super lightweight tracking mechanism configured never to break UI if the backend fails.
 */
export const trackTelemetry = async (eventType, payload = {}) => {
  try {
    const sessionId = getTelemetrySessionId();
    await fetch(`${API_URL}/api/analytics/track/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Uses standard text based fetch, no need for auth blockers
      body: JSON.stringify({
        event_type: eventType,
        payload: {
          ...payload,
          session_id: sessionId
        }
      })
    });
  } catch (error) {
     // Silent failure — analytics should never hurt runtime performance
     console.error('Telemetry track failed:', error);
  }
};

import { getAnalytics, logEvent } from 'firebase/analytics';

export class Analytics {
    static trackEvent(eventName, params = {}) {
        const analytics = getAnalytics();
        logEvent(analytics, eventName, {
            timestamp: new Date().toISOString(),
            ...params
        });
    }

    static trackSessionCompletion(sessionData) {
        this.trackEvent('session_completed', {
            sessionType: sessionData.type,
            duration: sessionData.duration,
            intensity: sessionData.intensity
        });
    }
}

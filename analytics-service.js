import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class AnalyticsService {
    static async logEvent(eventType, data) {
        try {
            const userId = auth.currentUser?.uid;
            await addDoc(collection(db, "analytics"), {
                eventType,
                userId,
                data,
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                platform: navigator.platform
            });
        } catch (error) {
            console.error('Error logging analytics:', error);
        }
    }

    static async logPageView(pageName) {
        await this.logEvent('page_view', { pageName });
    }

    static async logAction(actionName, details) {
        await this.logEvent('user_action', { actionName, details });
    }

    static async logError(errorType, errorDetails) {
        await this.logEvent('error', { errorType, errorDetails });
    }
}

import { db, auth } from './firebase-config.js';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class NotificationService {
    static async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    static async saveToken(token) {
        try {
            const userId = auth.currentUser.uid;
            const tokenData = {
                token,
                userId,
                platform: 'web',
                createdAt: serverTimestamp(),
                lastUsed: serverTimestamp()
            };

            await addDoc(collection(db, "notificationTokens"), tokenData);
            return true;
        } catch (error) {
            console.error('Error saving notification token:', error);
            return false;
        }
    }

    static async sendNotification(title, options = {}) {
        if (Notification.permission !== 'granted') {
            await this.requestPermission();
        }

        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/images/rugbylogo.png',
                badge: '/images/badge.png',
                ...options
            });

            notification.onclick = function() {
                window.focus();
                if (options.url) {
                    window.location.href = options.url;
                }
                notification.close();
            };

            // Log notification
            await this.logNotification({
                title,
                body: options.body,
                type: options.type || 'general'
            });
        }
    }

    static async logNotification(notificationData) {
        try {
            const userId = auth.currentUser.uid;
            await addDoc(collection(db, "notificationLogs"), {
                ...notificationData,
                userId,
                sentAt: serverTimestamp(),
                delivered: true
            });
        } catch (error) {
            console.error('Error logging notification:', error);
        }
    }

    static async updateNotificationSettings(settings) {
        try {
            const userId = auth.currentUser.uid;
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                notificationSettings: {
                    ...settings,
                    updatedAt: serverTimestamp()
                }
            });
            return true;
        } catch (error) {
            console.error('Error updating notification settings:', error);
            return false;
        }
    }
}

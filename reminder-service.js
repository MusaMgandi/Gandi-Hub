import { getUpcomingEvents, updateEventReminderStatus } from './firebase-data.js';
import { auth } from './firebase-config.js';

class ReminderService {
    constructor() {
        this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
        this.reminderThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    async init() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.startChecking();
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    startChecking() {
        this.checkReminders();
        setInterval(() => this.checkReminders(), this.checkInterval);
    }

    async checkReminders() {
        if (!auth.currentUser) return;

        try {
            const events = await getUpcomingEvents(auth.currentUser.uid);
            const now = new Date();

            events.forEach(event => {
                if (!event.reminderSent) {
                    const eventDate = new Date(event.eventDate);
                    const timeUntilEvent = eventDate.getTime() - now.getTime();

                    if (timeUntilEvent <= this.reminderThreshold) {
                        this.sendReminder(event);
                        updateEventReminderStatus(event.id, true);
                    }
                }
            });
        } catch (error) {
            console.error('Error checking reminders:', error);
        }
    }

    sendReminder(event) {
        const notification = new Notification('Upcoming Event Reminder', {
            body: `${event.title} - ${new Date(event.eventDate).toLocaleString()}`,
            icon: '/images/rugbylogo.png'
        });

        notification.onclick = () => {
            window.focus();
            // Navigate to events page if needed
            if (window.location.pathname !== '/events.html') {
                window.location.href = 'events.html';
            }
        };
    }
}

export const reminderService = new ReminderService();

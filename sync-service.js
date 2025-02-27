import { db, auth } from './firebase-config.js';
import { 
    collection, addDoc, updateDoc, doc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { LocalStorage } from './local-storage.js';

export class SyncService {
    static async syncPendingActivities() {
        const activities = LocalStorage.getActivities();
        const pendingActivities = activities.filter(a => a.pendingSync);

        for (const activity of pendingActivities) {
            try {
                const { id, pendingSync, ...activityData } = activity;
                
                await addDoc(collection(db, "activities"), {
                    ...activityData,
                    userId: auth.currentUser.uid,
                    completedAt: serverTimestamp()
                });

                LocalStorage.removeActivity(id);
            } catch (error) {
                console.error('Error syncing activity:', error);
            }
        }
    }

    static async syncPendingNotes() {
        const notes = LocalStorage.getNotes();
        const pendingNotes = notes.filter(n => n.pendingSync);

        for (const note of pendingNotes) {
            try {
                const { id, pendingSync, ...noteData } = note;
                
                await addDoc(collection(db, "notes"), {
                    ...noteData,
                    userId: auth.currentUser.uid,
                    savedAt: serverTimestamp()
                });

                LocalStorage.removeNote(id);
            } catch (error) {
                console.error('Error syncing note:', error);
            }
        }
    }

    static async markSessionComplete(sessionId) {
        try {
            const sessionRef = doc(db, "sessions", sessionId);
            await updateDoc(sessionRef, {
                status: 'completed',
                completedAt: serverTimestamp()
            });

            await Promise.all([
                this.syncPendingActivities(),
                this.syncPendingNotes()
            ]);
            
            return true;
        } catch (error) {
            console.error('Error completing session:', error);
            throw error;
        }
    }
}

import { db, auth } from './firebase-config.js';
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class UserManager {
    static async saveUserData(userData) {
        try {
            const userId = auth.currentUser.uid;
            await setDoc(doc(db, "users", userId), {
                ...userData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }

    static async getUserData() {
        try {
            const userId = auth.currentUser.uid;
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            throw error;
        }
    }

    static async updateUserPreferences(preferences) {
        try {
            const userId = auth.currentUser.uid;
            await updateDoc(doc(db, "users", userId), {
                preferences,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }
}

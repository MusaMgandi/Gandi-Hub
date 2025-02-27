import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class RatingService {
    static async submitRating(ratingData) {
        try {
            const data = {
                ...ratingData,
                userId: auth.currentUser.uid,
                timestamp: new Date().toISOString(),
                platform: navigator.platform,
                userAgent: navigator.userAgent
            };
            await addDoc(collection(db, "ratings"), data);
            return true;
        } catch (error) {
            console.error('Error submitting rating:', error);
            throw error;
        }
    }

    static async getUserRatings() {
        try {
            const userId = auth.currentUser.uid;
            const q = query(
                collection(db, "ratings"),
                where("userId", "==", userId),
                orderBy("timestamp", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting ratings:', error);
            throw error;
        }
    }

    static async checkLastRating() {
        try {
            const userId = auth.currentUser.uid;
            const q = query(
                collection(db, "ratings"),
                where("userId", "==", userId),
                orderBy("timestamp", "desc"),
                limit(1)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;
            return snapshot.docs[0].data();
        } catch (error) {
            console.error('Error checking last rating:', error);
            throw error;
        }
    }
}

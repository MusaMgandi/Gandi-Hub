import { db } from './firebase-config.js';
import { 
    collection, addDoc, getDocs, query, 
    where, orderBy, limit, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class FirestoreService {
    static async addTrainingSession(sessionData) {
        try {
            const sessionsRef = collection(db, 'trainingSessions');
            const docRef = await addDoc(sessionsRef, {
                ...sessionData,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding session:', error);
            throw error;
        }
    }

    static async getTrainingSessions(userId) {
        try {
            const q = query(
                collection(db, 'trainingSessions'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(50)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting sessions:', error);
            throw error;
        }
    }

    static async updateTrainingSession(sessionId, data) {
        try {
            const sessionRef = doc(db, 'trainingSessions', sessionId);
            await updateDoc(sessionRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating session:', error);
            throw error;
        }
    }

    static async deleteTrainingSession(sessionId) {
        try {
            const sessionRef = doc(db, 'trainingSessions', sessionId);
            await deleteDoc(sessionRef);
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }

    static async saveNote(noteData) {
        try {
            const notesRef = collection(db, 'trainingNotes');
            const docRef = await addDoc(notesRef, {
                ...noteData,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving note:', error);
            throw error;
        }
    }

    static async getNotes(userId) {
        try {
            const q = query(
                collection(db, 'trainingNotes'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting notes:', error);
            throw error;
        }
    }
}

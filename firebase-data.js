import { db, auth } from './firebase-config.js';
import { 
    collection, addDoc, updateDoc, deleteDoc, doc,
    query, where, getDocs, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Training sessions
export async function saveTrainingSession(sessionData) {
    try {
        const userId = auth.currentUser.uid;
        const data = {
            ...sessionData,
            userId,
            createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, "trainingSessions"), data);
        return docRef.id;
    } catch (error) {
        console.error('Error saving training session:', error);
        throw error;
    }
}

export async function getTrainingSessions(userId) {
    try {
        const q = query(
            collection(db, "trainingSessions"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting training sessions:', error);
        throw error;
    }
}

// Academic notes
export async function saveAcademicNote(noteData) {
    try {
        const userId = auth.currentUser.uid;
        const data = {
            ...noteData,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, "academicNotes"), data);
        return docRef.id;
    } catch (error) {
        console.error('Error saving academic note:', error);
        throw error;
    }
}

export async function getAcademicNotes(userId) {
    try {
        const q = query(
            collection(db, "academicNotes"),
            where("userId", "==", userId),
            orderBy("updatedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting academic notes:', error);
        throw error;
    }
}

// Grades tracking
export async function saveGrade(gradeData) {
    try {
        const userId = auth.currentUser.uid;
        const data = {
            ...gradeData,
            userId,
            recordedAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, "grades"), data);
        return docRef.id;
    } catch (error) {
        console.error('Error saving grade:', error);
        throw error;
    }
}

export async function getGrades(userId) {
    try {
        const q = query(
            collection(db, "grades"),
            where("userId", "==", userId),
            orderBy("recordedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting grades:', error);
        throw error;
    }
}

// Achievements tracking
export async function updateAchievement(achievementData) {
    try {
        const userId = auth.currentUser.uid;
        const achievementRef = query(
            collection(db, "achievements"),
            where("userId", "==", userId),
            where("achievementId", "==", achievementData.achievementId)
        );
        
        const snapshot = await getDocs(achievementRef);
        
        if (snapshot.empty) {
            return await addDoc(collection(db, "achievements"), {
                ...achievementData,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        const docRef = doc(db, "achievements", snapshot.docs[0].id);
        await updateDoc(docRef, {
            ...achievementData,
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error updating achievement:', error);
        throw error;
    }
}

export async function getAchievements(userId) {
    try {
        const q = query(
            collection(db, "achievements"),
            where("userId", "==", userId),
            orderBy("lastUpdated", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting achievements:', error);
        throw error;
    }
}

// Event Management
export async function saveEvent(eventData) {
    try {
        const userId = auth.currentUser.uid;
        const data = {
            ...eventData,
            userId,
            createdAt: new Date().toISOString(),
            reminderSent: false
        };
        const docRef = await addDoc(collection(db, "events"), data);
        return docRef.id;
    } catch (error) {
        console.error('Error saving event:', error);
        throw error;
    }
}

export async function getUpcomingEvents(userId) {
    try {
        const now = new Date().toISOString();
        const q = query(
            collection(db, "events"),
            where("userId", "==", userId),
            where("eventDate", ">=", now),
            orderBy("eventDate", "asc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting events:', error);
        throw error;
    }
}

export async function updateEventReminderStatus(eventId, status) {
    try {
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, {
            reminderSent: status
        });
    } catch (error) {
        console.error('Error updating event reminder status:', error);
        throw error;
    }
}

// User Profile Management
export async function saveUserProfile(userData) {
    try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        await setDoc(docRef, {
            ...userData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
}

export async function getUserProfile(userId) {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

export async function updateUserImage(userId, imageUrl) {
    try {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, {
            profileImage: imageUrl,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error updating user image:', error);
        throw error;
    }
}

import { auth } from './firebase-config.js';
import { AchievementTracker } from './achievement-tracker.js';

export class AuthService {
    // ...existing code...

    static async registerUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Initialize achievements for new user
            await AchievementTracker.ensureAchievementsInitialized(userCredential.user.uid);
            return userCredential.user;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    // ...existing code...
}

import { db, auth } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class AchievementInitService {
    static defaultAchievements = {
        academic: [
            {
                name: "Dean's List Scholar",
                description: "Maintain a GPA of 3.5 or higher for two consecutive semesters",
                progress: 0,
                maxProgress: 2,
                icon: "graduation-cap",
                type: "academic"
            },
            {
                name: "Perfect Score",
                description: "Achieve 100% on a major examination",
                progress: 0,
                maxProgress: 1,
                icon: "award",
                type: "academic"
            },
            {
                name: "Study Master",
                description: "Complete 50 study sessions",
                progress: 0,
                maxProgress: 50,
                icon: "brain",
                type: "academic"
            },
            {
                name: "Time Management Pro",
                description: "Submit 10 assignments before deadline",
                progress: 0,
                maxProgress: 10,
                icon: "clock",
                type: "academic"
            }
        ],
        training: [
            {
                name: "Training Warrior",
                description: "Complete 50 training sessions",
                progress: 0,
                maxProgress: 50,
                icon: "dumbbell",
                type: "training"
            },
            {
                name: "Consistency King",
                description: "Train for 7 consecutive days",
                progress: 0,
                maxProgress: 7,
                icon: "calendar-check",
                type: "training"
            },
            {
                name: "Skill Master",
                description: "Achieve advanced skill level",
                progress: 0,
                maxProgress: 8,
                icon: "star",
                type: "training"
            }
        ]
    };

    static async initializeUserAchievements(userId) {
        try {
            // Check if user already has achievements
            const existingAchievements = await this.getUserAchievements(userId);
            if (existingAchievements.length > 0) {
                return; // User already has achievements initialized
            }

            // Initialize academic achievements
            for (const achievement of this.defaultAchievements.academic) {
                await addDoc(collection(db, "achievements"), {
                    ...achievement,
                    userId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }

            // Initialize training achievements
            for (const achievement of this.defaultAchievements.training) {
                await addDoc(collection(db, "achievements"), {
                    ...achievement,
                    userId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }

            console.log('Achievements initialized for user:', userId);
        } catch (error) {
            console.error('Error initializing achievements:', error);
            throw error;
        }
    }

    static async getUserAchievements(userId) {
        const achievementsRef = query(
            collection(db, "achievements"),
            where("userId", "==", userId)
        );
        const snapshot = await getDocs(achievementsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

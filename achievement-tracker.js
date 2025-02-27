import { db, auth } from './firebase-config.js';
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { AchievementInitService } from './achievement-init-service.js';

export class AchievementTracker {
    static async checkAcademicAchievements(academicData) {
        const achievements = [];
        const userId = auth.currentUser.uid;

        // Dean's List Achievement
        if (academicData.consecutiveSemesters >= 2 && academicData.gpa >= 3.5) {
            achievements.push({
                name: "Dean's List Scholar",
                description: "Maintained GPA of 3.5+ for two consecutive semesters",
                type: "academic",
                icon: "graduation-cap",
                completedAt: new Date().toISOString()
            });
        }

        // Perfect Score Achievement
        if (academicData.hasExamScore === 100) {
            achievements.push({
                name: "Perfect Score",
                description: "Achieved 100% on a major examination",
                type: "academic",
                icon: "award",
                completedAt: new Date().toISOString()
            });
        }

        // Study Master Achievement
        if (academicData.studySessions >= 50) {
            achievements.push({
                name: "Study Master",
                description: "Completed 50 study sessions",
                type: "academic",
                icon: "brain",
                completedAt: new Date().toISOString()
            });
        }

        // Time Management Pro Achievement
        if (academicData.earlySubmissions >= 10) {
            achievements.push({
                name: "Time Management Pro",
                description: "Submitted 10 assignments before deadline",
                type: "academic",
                icon: "clock",
                completedAt: new Date().toISOString()
            });
        }

        // Save new achievements
        for (const achievement of achievements) {
            await this.saveAchievement(userId, achievement);
        }

        return achievements;
    }

    static async checkTrainingAchievements(trainingData) {
        const achievements = [];
        const userId = auth.currentUser.uid;

        // Training Milestones
        if (trainingData.sessionsCompleted >= 50) {
            achievements.push({
                name: "Training Warrior",
                description: "Completed 50 training sessions",
                type: "training",
                icon: "dumbbell",
                completedAt: new Date().toISOString()
            });
        }

        // Consistent Training
        if (trainingData.consecutiveDays >= 7) {
            achievements.push({
                name: "Consistency King",
                description: "Trained for 7 consecutive days",
                type: "training",
                icon: "calendar-check",
                completedAt: new Date().toISOString()
            });
        }

        // Skill Mastery
        if (trainingData.skillLevel >= 8) {
            achievements.push({
                name: "Skill Master",
                description: "Achieved advanced skill level",
                type: "training",
                icon: "star",
                completedAt: new Date().toISOString()
            });
        }

        // Team Leader
        if (trainingData.teamLeadSessions >= 5) {
            achievements.push({
                name: "Team Leader",
                description: "Led 5 team training sessions",
                type: "training",
                icon: "users",
                completedAt: new Date().toISOString()
            });
        }

        // Save new achievements
        for (const achievement of achievements) {
            await this.saveAchievement(userId, achievement);
        }

        return achievements;
    }

    static async saveAchievement(userId, achievementData) {
        try {
            // Check if achievement already exists
            const achievementRef = query(
                collection(db, "achievements"),
                where("userId", "==", userId),
                where("name", "==", achievementData.name)
            );

            const snapshot = await getDocs(achievementRef);
            
            if (snapshot.empty) {
                // Create new achievement
                await addDoc(collection(db, "achievements"), {
                    ...achievementData,
                    userId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });

                // Show notification
                this.showAchievementNotification(achievementData.name);
            }
        } catch (error) {
            console.error('Error saving achievement:', error);
        }
    }

    static showAchievementNotification(achievementName) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <i class="fas fa-trophy"></i>
            <div class="achievement-text">
                <h4>Achievement Unlocked!</h4>
                <p>${achievementName}</p>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    static async getAchievementProgress(userId) {
        try {
            const achievementsRef = query(
                collection(db, "achievements"),
                where("userId", "==", userId)
            );

            const snapshot = await getDocs(achievementsRef);
            const achievements = [];
            
            snapshot.forEach(doc => {
                achievements.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return achievements;
        } catch (error) {
            console.error('Error getting achievements:', error);
            return [];
        }
    }

    static async ensureAchievementsInitialized(userId) {
        try {
            await AchievementInitService.initializeUserAchievements(userId);
        } catch (error) {
            console.error('Error ensuring achievements initialization:', error);
        }
    }

    static async updateAchievementProgress(achievementName, progress) {
        try {
            const userId = auth.currentUser.uid;
            const achievementRef = query(
                collection(db, "achievements"),
                where("userId", "==", userId),
                where("name", "==", achievementName)
            );

            const snapshot = await getDocs(achievementRef);
            if (!snapshot.empty) {
                const achievement = snapshot.docs[0];
                const currentProgress = achievement.data().progress;
                const maxProgress = achievement.data().maxProgress;
                const newProgress = Math.min(currentProgress + progress, maxProgress);

                await updateDoc(doc(db, "achievements", achievement.id), {
                    progress: newProgress,
                    updatedAt: new Date().toISOString()
                });

                // Check if achievement is completed
                if (newProgress === maxProgress) {
                    this.showAchievementNotification(achievementName);
                }
            }
        } catch (error) {
            console.error('Error updating achievement progress:', error);
        }
    }
}

import { auth } from './firebase-config.js';

export class AuthGuard {
    static async checkAuth() {
        return new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe();
                if (user) {
                    resolve(user);
                } else {
                    window.location.href = 'login.html';
                    reject(new Error('User not authenticated'));
                }
            });
        });
    }

    static initializeAuthProtection() {
        const publicPages = ['/login.html', '/register.html', '/reset-password.html'];
        const currentPage = window.location.pathname;

        if (!publicPages.includes(currentPage)) {
            this.checkAuth().catch(error => {
                console.error('Auth check failed:', error);
            });
        }
    }

    static async requireAuth(callback) {
        try {
            const user = await this.checkAuth();
            return callback(user);
        } catch (error) {
            console.error('Auth required:', error);
            return null;
        }
    }
}

export class ErrorHandler {
    static handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        
        const errorMessages = {
            'auth/user-not-found': 'Invalid email or password',
            'auth/wrong-password': 'Invalid email or password',
            'auth/email-already-in-use': 'Email already registered',
            'network-error': 'Network connection error',
            'default': 'An unexpected error occurred'
        };

        return errorMessages[error.code] || errorMessages.default;
    }
}

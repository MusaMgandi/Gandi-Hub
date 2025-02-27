export class Validator {
    static validateSession(session) {
        const errors = {};

        if (!session.type) errors.type = 'Activity type is required';
        if (!session.date) errors.date = 'Date is required';
        if (!session.duration || session.duration < 0) errors.duration = 'Valid duration is required';

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static validateNote(note) {
        const errors = {};

        if (!note.content?.trim()) errors.content = 'Note content is required';
        if (!note.category) errors.category = 'Category is required';

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

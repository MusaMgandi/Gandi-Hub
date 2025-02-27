
export const LocalStorage = {
    // Activities
    saveActivity(activity) {
        const activities = this.getActivities();
        activities.push({ ...activity, id: Date.now(), pendingSync: true });
        localStorage.setItem('pendingActivities', JSON.stringify(activities));
    },

    getActivities() {
        return JSON.parse(localStorage.getItem('pendingActivities') || '[]');
    },

    removeActivity(activityId) {
        const activities = this.getActivities().filter(a => a.id !== activityId);
        localStorage.setItem('pendingActivities', JSON.stringify(activities));
    },

    // Notes
    saveNote(note) {
        const notes = this.getNotes();
        notes.push({ ...note, id: Date.now(), pendingSync: true });
        localStorage.setItem('pendingNotes', JSON.stringify(notes));
    },

    getNotes() {
        return JSON.parse(localStorage.getItem('pendingNotes') || '[]');
    },

    removeNote(noteId) {
        const notes = this.getNotes().filter(n => n.id !== noteId);
        localStorage.setItem('pendingNotes', JSON.stringify(notes));
    },

    // Clear completed items
    clearSynced(type) {
        const items = this.getActivities();
        const remaining = items.filter(item => item.pendingSync);
        localStorage.setItem(`pending${type}`, JSON.stringify(remaining));
    }
};

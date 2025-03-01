export class LocalStorage {
    static saveActivity(activity) {
        const activities = this.getActivities();
        activities.push({...activity, pendingSync: true});
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    static getActivities() {
        return JSON.parse(localStorage.getItem('activities') || '[]');
    }

    static saveNote(note) {
        const notes = this.getNotes();
        notes.push({...note, pendingSync: true});
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    static getNotes() {
        return JSON.parse(localStorage.getItem('notes') || '[]');
    }

    static clearSynced(type) {
        const items = this[`get${type}`]();
        const pending = items.filter(item => item.pendingSync);
        localStorage.setItem(type.toLowerCase(), JSON.stringify(pending));
    }
}

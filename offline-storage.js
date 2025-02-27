export class OfflineStorage {
    static saveLocally(key, data) {
        try {
            const existingData = JSON.parse(localStorage.getItem(key) || '[]');
            existingData.push({...data, pendingSync: true});
            localStorage.setItem(key, JSON.stringify(existingData));
            return true;
        } catch (error) {
            console.error('Error saving to local storage:', error);
            return false;
        }
    }

    static async syncWithServer() {
        const pendingItems = this.getPendingItems();
        for (const item of pendingItems) {
            try {
                await this.syncItem(item);
                this.markAsSynced(item.id);
            } catch (error) {
                console.error('Sync error:', error);
            }
        }
    }
}

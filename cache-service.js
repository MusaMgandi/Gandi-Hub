export class CacheService {
    static CACHE_VERSION = 'v1';
    static CACHE_NAME = `gandi-hub-${this.CACHE_VERSION}`;

    static async initialize() {
        try {
            const cache = await caches.open(this.CACHE_NAME);
            await cache.addAll([
                '/',
                '/index.html',
                '/styles/*.css',
                '/images/*.{png,jpg,jpeg,gif,webp}',
                '/firebase-config.js',
                '/user-manager.js',
                '/error-handler.js',
                '/auth-guard.js'
            ]);
        } catch (error) {
            console.error('Cache initialization failed:', error);
        }
    }

    static async getData(key) {
        const storageData = localStorage.getItem(key);
        if (storageData) {
            const { value, timestamp, expiry } = JSON.parse(storageData);
            if (!expiry || timestamp + expiry > Date.now()) {
                return value;
            }
            localStorage.removeItem(key);
        }
        return null;
    }

    static async setData(key, value, expiryMinutes = 60) {
        const data = {
            value,
            timestamp: Date.now(),
            expiry: expiryMinutes * 60 * 1000
        };
        localStorage.setItem(key, JSON.stringify(data));
    }

    static async clearCache() {
        try {
            const keys = await caches.keys();
            await Promise.all(
                keys.map(key => {
                    if (key !== this.CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        } catch (error) {
            console.error('Cache clearing failed:', error);
        }
    }
}

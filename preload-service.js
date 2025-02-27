export class PreloadService {
    static async preloadImages(imageUrls) {
        const promises = imageUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => reject(url);
                img.src = url;
            });
        });

        try {
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Error preloading images:', error);
            return false;
        }
    }

    static addImageFallback(imgElement) {
        imgElement.onerror = function() {
            this.onerror = null; // Prevent infinite loops
            this.src = 'images/placeholder.jpg';
        };
    }
}

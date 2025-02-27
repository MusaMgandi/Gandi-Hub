export class ImageService {
    static async verifyImage(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error(`Error verifying image ${url}:`, error);
            return false;
        }
    }

    static getPlaceholder(width = 800, height = 600, text = 'Image not found') {
        return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
    }

    // Define required images for each page
    static requiredImages = {
        homepage: [
            'images/rugbylogo.png',
            'images/event1.jpg',
            'images/event2.jpg',
            'images/event3.jpg',
            'images/rugby1.jpg',
            'images/rugby10.jpg',
            'images/training1.jpg',
            'images/edu1.jpg',
            'images/edu2.png',
            'images/rugby15.jpg',
            'images/rugbyai1.png',
            'images/rugbyai3.png',
            'images/rugbyai5.png'
        ],
        events: [
            'images/rugby12.jpg',
            'images/rugby13.jpg'
        ],
        training: [
            'images/rugbylogo.png',
            'images/training-bg.jpg'
        ],
        academics: [
            'images/rugbylogo.png',
            'images/academic-bg.jpg'
        ]
    };

    static async verifyRequiredImages(pageName) {
        const results = {
            valid: [],
            invalid: []
        };

        const images = this.requiredImages[pageName] || [];
        
        for (const imageUrl of images) {
            const isValid = await this.verifyImage(imageUrl);
            if (isValid) {
                results.valid.push(imageUrl);
            } else {
                results.invalid.push(imageUrl);
                console.warn(`Missing image: ${imageUrl}`);
            }
        }

        return results;
    }

    static generateImageSet(url) {
        // Generate srcset for responsive images
        return {
            src: url,
            srcset: `
                ${url} 300w,
                ${url} 600w,
                ${url} 900w,
                ${url} 1200w
            `,
            sizes: "(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 900px) 900px, 1200px"
        };
    }
}

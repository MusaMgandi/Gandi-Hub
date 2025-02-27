import { ImageService } from './image-service.js';

export class ImageChecker {
    static imagesRequired = {
        homepage: {
            logo: '/images/rugbylogo.png',
            events: [
                '/images/event1.jpg',
                '/images/event2.jpg',
                '/images/event3.png'  // Fixed extension
            ],
            rugby: [
                '/images/rugby1.jpg',
                '/images/rugby10.jpg',
                '/images/rugby12.jpg',
                '/images/rugby13.jpg',
                '/images/rugby15.jpg'
            ],
            training: [
                '/images/training1.jpg'
            ],
            education: [
                '/images/edu1.jpg',
                '/images/edu2.png'
            ],
            ai: [
                '/images/rugbyai1.png',
                '/images/rugbyai3.png',
                '/images/rugbyai5.png'
            ]
        }
    };

    static async checkAllImages() {
        const results = {
            valid: [],
            invalid: [],
            missing: []
        };

        for (const [page, categories] of Object.entries(this.imagesRequired)) {
            for (const [category, images] of Object.entries(categories)) {
                if (Array.isArray(images)) {
                    for (const image of images) {
                        try {
                            const exists = await ImageService.verifyImage(image);
                            if (exists) {
                                results.valid.push(image);
                            } else {
                                results.invalid.push({
                                    page,
                                    category,
                                    path: image
                                });
                            }
                        } catch (error) {
                            results.missing.push({
                                page,
                                category,
                                path: image,
                                error: error.message
                            });
                        }
                    }
                } else {
                    try {
                        const exists = await ImageService.verifyImage(images);
                        if (exists) {
                            results.valid.push(images);
                        } else {
                            results.invalid.push({
                                page,
                                category,
                                path: images
                            });
                        }
                    } catch (error) {
                        results.missing.push({
                            page,
                            category,
                            path: images,
                            error: error.message
                        });
                    }
                }
            }
        }
        return results;
    }
}

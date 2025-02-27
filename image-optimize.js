const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = './images';
const outputDir = './images/optimized';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Optimization settings
const settings = {
    jpeg: { quality: 80, progressive: true },
    png: { compressionLevel: 8, progressive: true },
    webp: { quality: 75 }
};

// Process images
fs.readdir(sourceDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const inputPath = path.join(sourceDir, file);
        const fileExt = path.extname(file).toLowerCase();

        // Only process image files
        if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
            // Convert to WebP
            const webpOutput = path.join(outputDir, `${path.parse(file).name}.webp`);
            sharp(inputPath)
                .resize(1200, null, { withoutEnlargement: true }) // Resize width to max 1200px
                .webp(settings.webp)
                .toFile(webpOutput)
                .then(() => console.log(`Converted ${file} to WebP`))
                .catch(err => console.error(`Error processing ${file}:`, err));

            // Optimize original format
            const optimizedOutput = path.join(outputDir, file);
            sharp(inputPath)
                .resize(1200, null, { withoutEnlargement: true })
                [fileExt === '.png' ? 'png' : 'jpeg'](fileExt === '.png' ? settings.png : settings.jpeg)
                .toFile(optimizedOutput)
                .then(() => console.log(`Optimized ${file}`))
                .catch(err => console.error(`Error optimizing ${file}:`, err));
        }
    });
});

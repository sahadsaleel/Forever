import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Configure dotenv to read from .env file
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    // Cloudinary credentials from .env
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

    // Default folder in Cloudinary
    cloud_folder: 'weddings',

    // Map folder names to tags/categories (Folder Name -> Tag)
    categoryMap: {
        'ceremony': 'ceremony',
        'reception': 'reception',
        'candid': 'candid',
        'family': 'family',
        'prewedding': 'prewedding'
    },

    // Path to save the manifest
    manifestPath: path.resolve(__dirname, '../src/data/images.json')
};

// Initialize Cloudinary
cloudinary.config({
    cloud_name: CONFIG.cloud_name,
    api_key: CONFIG.api_key,
    api_secret: CONFIG.api_secret
});

// Store uploaded image data
const uploadedImages = [];

/**
 * Uploads a single file to Cloudinary
 */
const uploadImage = async (filePath, category) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `${CONFIG.cloud_folder}/${category}`,
            tags: ['wedding', category],
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        });

        console.log(`✅ Uploaded: ${path.basename(filePath)} -> ${result.secure_url}`);

        // Add to manifest data
        uploadedImages.push({
            id: result.public_id,
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            category: category
        });

        return result;
    } catch (error) {
        console.error(`❌ Failed: ${path.basename(filePath)}`, error.message);
        return null;
    }
};

/**
 * Main function to walk through directories
 */
const processDirectory = async (baseDir) => {
    console.log(`📂 Scanning directory: ${baseDir}`);

    if (!fs.existsSync(baseDir)) {
        console.error(`❌ Directory not found: ${baseDir}`);
        console.log('Please set the TARGET_DIR variable or pass it as an argument.');
        return;
    }

    const items = fs.readdirSync(baseDir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(baseDir, item.name);

        if (item.isDirectory()) {
            // Check if this directory corresponds to a category
            const category = CONFIG.categoryMap[item.name.toLowerCase()] || 'uncategorized';
            console.log(`\nProcessing Category Folder: ${item.name} (Tag: ${category})`);

            // Upload all files in this subdirectory
            const files = fs.readdirSync(fullPath);
            for (const file of files) {
                if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
                    await uploadImage(path.join(fullPath, file), category);
                }
            }
        }
        else if (item.isFile() && item.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
            // Files in the root directory (assign to 'uncategorized' or 'all')
            await uploadImage(fullPath, 'all');
        }
    }

    // Write manifest file
    try {
        fs.writeFileSync(CONFIG.manifestPath, JSON.stringify(uploadedImages, null, 2));
        console.log(`\n📝 Manifest saved to: ${CONFIG.manifestPath}`);
    } catch (err) {
        console.error('\n❌ Failed to save manifest:', err);
    }

    console.log('\n✨ All uploads completed!');
};

// Get directory from command line args
const targetDir = process.argv[2];

if (!targetDir) {
    console.log(`
Usage: node scripts/upload-images.js <path-to-images-folder>

Structure your images folder like this for automatic categorization:
/images
  /ceremony
     img1.jpg
  /reception
     img2.jpg
  /candid
     img3.jpg
    `);
} else {
    processDirectory(targetDir);
}

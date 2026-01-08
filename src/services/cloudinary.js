/**
 * Cloudinary Service
 * Handles image URL generation and fetching.
 * Currently uses mock data if credentials are missing.
 */

import imageData from '../data/images.json';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

// Base URL for fetching resources (if using Admin API via backend, but here we might need to use a client-side list or JSON)
// For this demo, we'll simulate fetching a list of images.

// Fallback if no images are uploaded yet
const MOCK_IMAGES = [
    { id: '1', publicId: 'weddings/hero-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80', width: 1920, height: 1080, category: 'reception' },
    { id: '2', publicId: 'weddings/hero-2', url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80', width: 1920, height: 1080, category: 'ceremony' },
    { id: '3', publicId: 'weddings/hero-3', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80', width: 1920, height: 1080, category: 'candid' },
];

/**
 * Returns a full Cloudinary URL for a given public ID.
 * @param {string} publicId 
 * @param {object} options 
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
    // If it's a full URL (mock), return it
    if (publicId.startsWith('http')) return publicId;

    // Basic implementation - in real app, might use cloudinary-react or build string
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;
};

/**
 * Fetches list of images. 
 */
export const fetchImages = async (category = 'all', page = 1, limit = 20) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use uploaded images if available, otherwise fallback to mock
    let images = imageData.length > 0 ? imageData : MOCK_IMAGES;

    if (category !== 'all') {
        images = images.filter(img => img.category === category);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return images.slice(0, endIndex);
};

export const fetchHeroImages = async () => {
    let images = imageData.length > 0 ? imageData : MOCK_IMAGES;
    // Shuffle or pick specific hero images
    return images.slice(0, 3);
}

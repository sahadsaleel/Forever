import React, { useState } from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';
import Lightbox from '../components/ui/Lightbox';
import { AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="min-h-screen pt-16 pb-20 bg-ivory">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-7xl text-gray-800 mb-6 relative inline-block" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Forever
                        <span className="absolute -bottom-2 left-1/4 w-1/2 h-[1px] bg-champagne-gold"></span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light">
                        Relive the magic of our special day.
                    </p>
                </div>

                <GalleryGrid onImageClick={setSelectedImage} />

                <AnimatePresence>
                    {selectedImage && (
                        <Lightbox
                            image={selectedImage}
                            onClose={() => setSelectedImage(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Gallery;

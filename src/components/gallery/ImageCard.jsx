import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Maximize2 } from 'lucide-react';

const ImageCard = ({ image, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative mb-6 break-inside-avoid rounded-lg overflow-hidden group shadow-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`bg-gray-200 w-full ${isLoaded ? 'opacity-0 absolute' : 'opacity-100 h-64 animate-pulse'}`}
            />
            <img
                src={image.url}
                alt={image.publicId}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-auto object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'
                    } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Overlay */}
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex flex-col justify-end p-4 ${isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                <div className="flex justify-between items-center text-white">
                    <button
                        onClick={() => onClick(image)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
                        title="View Fullscreen"
                    >
                        <Maximize2 size={18} />
                    </button>

                    {/* Download button directly here for convenience */}
                    <a
                        href={image.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
                        title="Download Original"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Download size={18} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default ImageCard;

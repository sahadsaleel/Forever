import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

const Lightbox = ({ image, onClose }) => {
    const [scale, setScale] = React.useState(1);

    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!image) return null;

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, 1));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Controls */}
            <div className="absolute top-4 right-4 flex space-x-4 text-white z-50">
                <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn size={24} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut size={24} />
                </button>
                <a
                    href={image.url}
                    download
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Download Original"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Download size={24} />
                </a>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Image Container */}
            <div
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <motion.img
                    src={image.url}
                    alt={image.publicId}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: scale, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    drag
                    dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                    className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing shadow-2xl"
                />
            </div>
        </motion.div>
    );
};

export default Lightbox;

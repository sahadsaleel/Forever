import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from './ImageCard';
import FilterBar from './FilterBar';
import { fetchImages } from '../../services/cloudinary';
import { Loader2 } from 'lucide-react';

const GalleryGrid = ({ onImageClick }) => {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const IMAGES_PER_PAGE = 8;

    // Masonry Column State
    const [numColumns, setNumColumns] = useState(1);

    const observer = useRef();
    const lastImageRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Handle Window Resize for Columns
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) setNumColumns(4);
            else if (window.innerWidth >= 1024) setNumColumns(3);
            else if (window.innerWidth >= 768) setNumColumns(2);
            else setNumColumns(1);
        };

        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset when category changes
    useEffect(() => {
        setImages([]);
        setFilteredImages([]);
        setPage(1);
        setHasMore(true);
    }, [activeCategory]);

    // Load images when page or category changes
    useEffect(() => {
        const loadImages = async () => {
            setLoading(true);
            try {
                const data = await fetchImages(activeCategory, page, IMAGES_PER_PAGE);

                setImages(data);
                setFilteredImages(data);

                if (data.length < page * IMAGES_PER_PAGE) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

            } catch (error) {
                console.error("Failed to load images", error);
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, [page, activeCategory]);

    // Distribute images into columns
    const columns = Array.from({ length: numColumns }, () => []);
    filteredImages.forEach((img, index) => {
        columns[index % numColumns].push(img);
    });

    return (
        <div className="w-full">
            <FilterBar activeCategory={activeCategory} onFilterChange={setActiveCategory} />

            <div className="flex gap-6 px-4 items-start">
                {columns.map((colImages, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-6 flex-1">
                        <AnimatePresence>
                            {colImages.map((img, imgIndex) => {
                                // Start Intersection Observer on the LAST image of the LAST column (or simply last image effectively)
                                // Since we distribute round-robin, the absolute last image might be in any column.
                                // However, observing the last rendered element in DOM is sufficient.
                                // We can check if this image is the very last one in `filteredImages`.
                                const isLastImage = img.id === filteredImages[filteredImages.length - 1].id;

                                if (isLastImage) {
                                    return (
                                        <div ref={lastImageRef} key={img.id} className="w-full">
                                            <ImageCard image={img} onClick={onImageClick} />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={img.id} className="w-full">
                                            <ImageCard image={img} onClick={onImageClick} />
                                        </div>
                                    )
                                }
                            })}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center py-10 w-full">
                    <Loader2 className="animate-spin text-champagne-gold" size={40} />
                </div>
            )}

            {!loading && filteredImages.length === 0 && (
                <div className="text-center py-20 text-gray-400 w-full">
                    No photos found in this category.
                </div>
            )}
        </div>
    );
};

export default GalleryGrid;

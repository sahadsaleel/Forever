import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white/50 border-t border-gray-100 py-12 mt-auto font-body">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-xl font-display uppercase tracking-widest text-gray-800 mb-4">
                    Safvan & Shahala • Ramzan & Shadhina
                </h2>
                <p className="text-gray-500 text-sm tracking-wide mb-6">
                    Oct 25, 2026 • Kerala, India
                </p>

                <div className="flex justify-center items-center text-gray-400 text-xs tracking-widest gap-1">
                    <span>MADE WITH</span>
                    <Heart size={12} className="text-blush-pink fill-current" />
                    <span>LOVE</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

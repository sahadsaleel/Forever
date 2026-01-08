import React from 'react';

const categories = [
    { id: 'all', label: 'All Photos' },
];

const FilterBar = ({ activeCategory, onFilterChange }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onFilterChange(cat.id)}
                    className={`px-6 py-2 rounded-full text-sm tracking-widest uppercase transition-all duration-300 ${activeCategory === cat.id
                        ? 'bg-champagne-gold text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;

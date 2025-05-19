import React from 'react';

export default function FilterPanel({ isOpen, onClose, filters, onFilterChange, onRemoveFilter, cars }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transform transition-transform duration-300 ease-in-out shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Selected Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Filters</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div
                  key={key}
                  className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                >
                  <span className="capitalize">{key}: {value}</span>
                  <button
                    onClick={() => onRemoveFilter(key)}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Options */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto bg-gray-50">
          {/* Make Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
            <select
              value={filters.make}
              onChange={(e) => onFilterChange('make', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="">All Makes</option>
              {[...new Set(cars.map(car => car.make))].map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Model Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <select
              value={filters.model}
              onChange={(e) => onFilterChange('model', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="">All Models</option>
              {[...new Set(cars.map(car => car.model))].map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => onFilterChange('year', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="">All Years</option>
              {[...new Set(cars.map(car => car.year))].sort((a, b) => b - a).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 bg-white">
          <button
            onClick={() => {
              Object.keys(filters).forEach(key => onFilterChange(key, ''));
              onClose();
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
} 
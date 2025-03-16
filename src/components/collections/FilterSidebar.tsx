import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedDimensions: string[];
  onDimensionChange: (dimension: string) => void;
  inStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  selectedDimensions,
  onDimensionChange,
  inStockOnly,
  onInStockChange,
  isOpen,
  onClose
}: FilterSidebarProps) {
  const dimensions = ['size'];
  const [minPrice, maxPrice] = priceRange;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={onClose}
        />
      )}
    
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Price Range */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => onPriceRangeChange([+e.target.value, maxPrice])}
                    className="w-24 px-2 py-1 border rounded-md"
                    min={0}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => onPriceRangeChange([minPrice, +e.target.value])}
                    className="w-24 px-2 py-1 border rounded-md"
                    min={minPrice}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={maxPrice}
                  onChange={(e) => onPriceRangeChange([minPrice, +e.target.value])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Availability</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onInStockChange(e.target.checked)}
                  className="h-4 w-4 text-amber-600 rounded border-gray-300"
                />
                <span className="ml-2 text-gray-600">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
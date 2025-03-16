import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import ProductGrid from '../components/collections/ProductGrid';
import FilterSidebar from '../components/collections/FilterSidebar';
import { Filter } from 'lucide-react';

type Category = 'gel' | 'dried' | 'all';
type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function Collections() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('gel');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');

  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory);

    // Apply price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Apply dimension filter
    if (selectedDimensions.length > 0) {
      filtered = filtered.filter(p => 
        selectedDimensions.some(dim => p.dimensions[dim as keyof typeof p.dimensions] !== undefined)
      );
    }

    // Apply stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, priceRange, selectedDimensions, inStockOnly, sortOption]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      window.addEventListener('keydown', handleEscape);
      // Prevent scrolling when filter is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Collections</h1>
      
      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('gel')}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedCategory === 'gel'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sea Moss Gel
            </button>
            <button
              onClick={() => setSelectedCategory('dried')}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedCategory === 'dried'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dried Sea Moss
            </button>
          </div>
        </div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        selectedDimensions={selectedDimensions}
        onDimensionChange={(dimension) => {
          setSelectedDimensions(prev =>
            prev.includes(dimension)
              ? prev.filter(d => d !== dimension)
              : [...prev, dimension]
          );
        }}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
      />

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
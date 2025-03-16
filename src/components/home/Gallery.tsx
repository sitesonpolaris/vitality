import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GALLERY_IMAGES = [
  'https://static.wixstatic.com/media/c73eb8_9c32b18a5bae4597816d66ca12958e46~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_71fda8cd9edd43119f6921360abb2f39~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_fbaa663c871d4136a358790fd4cef1c1~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_6f65ec63140b4199b07bf1703e80f78c~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_3bd133b17b7c453dbccc393606ddfe0b~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_536c539ea28f4681a816fcd515bddc47~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_c52318a4dd9a402db17dafdfdb694c06~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_a17329ea6c924051ad8e8ec6843b79eb~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_d6c73262f2d34a68b3f3d2d126d210b1~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_45de8f50352c4c21b62d3139bc5c30a1~mv2.jpg',
  'https://static.wixstatic.com/media/c73eb8_6ca46856138149649d482c61be01d735~mv2.jpg'
];

export default function Gallery() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth;
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-20 bg-white overflow-hidden ">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-4xl text-primary mb-4">
            Our Journey in Pictures
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From harvesting in the pristine Caribbean waters to transforming lives through wellness,
            explore our visual story of natural healing and vitality.
          </p>
        </div>

        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-primary" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-primary" />
          </button>

          {/* Gallery Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {GALLERY_IMAGES.map((image, index) => (
              <div
                key={index}
                className="flex-none w-80 h-80 snap-center p-2"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="relative h-full overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm font-medium">Discover our story</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
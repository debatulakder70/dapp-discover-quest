import { categories, Category } from '@/data/tools';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-2 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'category-tab whitespace-nowrap',
              activeCategory === category.id && 'category-tab-active'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

import { SearchBar } from './SearchBar';
import { ChainFilter } from './ChainFilter';
import { Chain } from '@/data/tools';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedChains: Chain[];
  onChainToggle: (chain: Chain) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function FilterSection({
  searchQuery,
  onSearchChange,
  selectedChains,
  onChainToggle,
  onClearFilters,
  activeFiltersCount,
}: FilterSectionProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar value={searchQuery} onChange={onSearchChange} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
              'border hover:bg-secondary/50',
              showFilters || activeFiltersCount > 0
                ? 'border-primary/50 text-primary bg-primary/5'
                : 'border-border text-muted-foreground'
            )}
          >
            <Filter className="w-4 h-4" />
            Chains
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl border border-border hover:bg-secondary/50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Collapsible chain filter */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pt-2">
          <ChainFilter
            selectedChains={selectedChains}
            onChainToggle={onChainToggle}
          />
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/CategoryTabs';
import { FilterSection } from '@/components/FilterSection';
import { ToolGrid } from '@/components/ToolGrid';
import { StatsBar } from '@/components/StatsBar';
import { ToolDetailModal } from '@/components/ToolDetailModal';
import { tools, Category, Chain, Tool } from '@/data/tools';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChains, setSelectedChains] = useState<Chain[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChainToggle = (chain: Chain) => {
    setSelectedChains((prev) =>
      prev.includes(chain)
        ? prev.filter((c) => c !== chain)
        : [...prev, chain]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedChains([]);
  };

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category filter
      if (activeCategory !== 'all' && !tool.categories.includes(activeCategory)) {
        return false;
      }

      // Chain filter
      if (selectedChains.length > 0 && !selectedChains.some((c) => tool.chains.includes(c))) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.categories.some((c) => c.toLowerCase().includes(query)) ||
          tool.chains.some((c) => c.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedChains]);

  const activeFiltersCount = selectedChains.length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <main className="container py-8 space-y-8">
          {/* Hero section */}
          <section className="text-center space-y-4 py-8">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Your Gateway to{' '}
              <span className="gradient-text">Web3</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and access the best DeFi protocols, trading tools, and blockchain analytics — all in one place.
            </p>
          </section>

          {/* Stats */}
          <StatsBar />

          {/* Category tabs */}
          <section className="glass-card p-4">
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </section>

          {/* Filters */}
          <FilterSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedChains={selectedChains}
            onChainToggle={handleChainToggle}
            onClearFilters={handleClearFilters}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground">
                {filteredTools.length}
              </span>{' '}
              {filteredTools.length === 1 ? 'tool' : 'tools'}
              {activeCategory !== 'all' && (
                <>
                  {' '}in{' '}
                  <span className="font-medium text-primary">
                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace('-', ' ')}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Tool grid */}
          <ToolGrid tools={filteredTools} onOpenDetail={(tool) => { setSelectedTool(tool); setModalOpen(true); }} />
        </main>

        {/* Tool Detail Modal */}
        <ToolDetailModal tool={selectedTool} open={modalOpen} onOpenChange={setModalOpen} />

        {/* Footer */}
        <footer className="border-t border-border/40 mt-16">
          <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Web3Hub. Discovery platform only — no trades executed.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Always DYOR. We don't endorse any specific protocol.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;

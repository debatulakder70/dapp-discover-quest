import { chains, Chain } from '@/data/tools';
import { cn } from '@/lib/utils';

interface ChainFilterProps {
  selectedChains: Chain[];
  onChainToggle: (chain: Chain) => void;
}

export function ChainFilter({ selectedChains, onChainToggle }: ChainFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chains.map((chain) => {
        const isSelected = selectedChains.includes(chain.id);
        return (
          <button
            key={chain.id}
            onClick={() => onChainToggle(chain.id)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
              'border hover:scale-105',
              isSelected
                ? `${chain.color} border-current`
                : 'bg-secondary/50 text-muted-foreground border-border/50 hover:border-border'
            )}
          >
            {chain.label}
          </button>
        );
      })}
    </div>
  );
}

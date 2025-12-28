import { tools, Tool } from '@/data/tools';
import { TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendingSectionProps {
  onToolClick: (tool: Tool) => void;
}

export function TrendingSection({ onToolClick }: TrendingSectionProps) {
  // Get popular tools for trending section
  const trendingTools = tools
    .filter((tool) => tool.isPopular)
    .slice(0, 5);

  return (
    <section className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Trending DApps</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {trendingTools.map((tool, index) => (
          <button
            key={tool.id}
            onClick={() => onToolClick(tool)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl text-left transition-all',
              'bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-primary/30'
            )}
          >
            <div className="relative">
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <span className={cn(
                'absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                index === 0 ? 'bg-yellow-500 text-yellow-950' :
                index === 1 ? 'bg-gray-300 text-gray-950' :
                index === 2 ? 'bg-amber-600 text-amber-950' :
                'bg-secondary text-muted-foreground'
              )}>
                {index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{tool.name}</p>
              <p className="text-xs text-muted-foreground truncate">{tool.tvl}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

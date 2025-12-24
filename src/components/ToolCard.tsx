import { Tool, chains } from '@/data/tools';
import { ExternalLink, BadgeCheck, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const handleClick = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const toolChains = chains.filter((c) => tool.chains.includes(c.id));

  return (
    <article
      onClick={handleClick}
      className={cn(
        'glass-card glass-card-hover glow-effect cursor-pointer p-6 group relative overflow-hidden',
        'animate-fade-in'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
              <img
                src={tool.logo}
                alt={`${tool.name} logo`}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${tool.name}&background=1a1a2e&color=22d3ee&size=64`;
                }}
              />
            </div>

            {/* Name and badges */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                {tool.verified && (
                  <BadgeCheck className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {tool.isNew && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                    <Sparkles className="w-3 h-3" />
                    New
                  </span>
                )}
                {tool.isPopular && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* External link icon */}
          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Chains */}
        <div className="flex flex-wrap gap-1.5">
          {toolChains.slice(0, 4).map((chain) => (
            <span
              key={chain.id}
              className={cn('chain-badge', chain.color)}
            >
              {chain.id}
            </span>
          ))}
          {toolChains.length > 4 && (
            <span className="chain-badge">+{toolChains.length - 4}</span>
          )}
        </div>
      </div>
    </article>
  );
}

import { useState } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tool, chains } from '@/data/tools';
import { FavoriteButton } from './FavoriteButton';
import { useDefiLlamaData, formatTVL, formatChange } from '@/hooks/useDefiLlamaData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FavoriteToolCardProps {
  tool: Tool;
  index: number;
  onOpenDetail: (tool: Tool) => void;
}

export function FavoriteToolCard({ tool, index, onOpenDetail }: FavoriteToolCardProps) {
  const [imageError, setImageError] = useState(false);
  const { data: liveData, loading: dataLoading } = useDefiLlamaData(tool.id);

  const chainColors = chains.reduce((acc, chain) => {
    acc[chain.id] = chain.color;
    return acc;
  }, {} as Record<string, string>);

  const displayedChains = tool.chains.slice(0, 4);
  const remainingChains = tool.chains.length - 4;

  const tvlDisplay = liveData ? formatTVL(liveData.tvl) : tool.tvl;
  const change1d = liveData ? formatChange(liveData.change_1d) : null;

  return (
    <Card 
      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onClick={() => onOpenDetail(tool)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden">
              {!imageError ? (
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="w-8 h-8 object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-lg font-bold text-muted-foreground">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{tool.name}</h3>
                {tool.verified && (
                  <Shield className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex gap-1 mt-1">
                {displayedChains.map((chain) => (
                  <span
                    key={chain}
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded',
                      chainColors[chain] || 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {chain}
                  </span>
                ))}
                {remainingChains > 0 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    +{remainingChains}
                  </span>
                )}
              </div>
            </div>
          </div>
          <FavoriteButton toolId={tool.id} size="sm" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {tool.description}
        </p>

        {/* Live Stats */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">TVL</p>
            <div className="flex items-center gap-2">
              {dataLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  {tvlDisplay || 'N/A'}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">24h Change</p>
            <div className="flex items-center gap-1">
              {dataLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : change1d ? (
                <>
                  {change1d.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={cn(
                    'text-sm font-semibold',
                    change1d.isPositive ? 'text-green-400' : 'text-red-400'
                  )}>
                    {change1d.text}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>

        {/* External link */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
        >
          Visit DApp
          <ExternalLink className="w-4 h-4" />
        </a>
      </CardContent>
    </Card>
  );
}

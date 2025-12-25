import { Tool, chains } from '@/data/tools';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ExternalLink,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Calendar,
  Star,
  Twitter,
  MessageCircle,
  Github,
  FileText,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ToolDetailModalProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToolDetailModal({ tool, open, onOpenChange }: ToolDetailModalProps) {
  if (!tool) return null;

  const toolChains = chains.filter((c) => tool.chains.includes(c.id));
  const averageRating = tool.reviews?.length
    ? (tool.reviews.reduce((acc, r) => acc + r.rating, 0) / tool.reviews.length).toFixed(1)
    : null;

  const handleVisit = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <DialogHeader className="space-y-4">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center overflow-hidden ring-1 ring-border/50 flex-shrink-0">
                  <img
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${tool.name}&background=1a1a2e&color=22d3ee&size=64`;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {tool.name}
                    </DialogTitle>
                    {tool.verified && (
                      <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                    {tool.isNew && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        New
                      </span>
                    )}
                    {tool.isPopular && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {averageRating && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'w-4 h-4',
                              star <= Math.round(Number(averageRating))
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-foreground ml-1">
                        {averageRating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({tool.reviews?.length} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </DialogHeader>

            {/* Chains */}
            <div className="flex flex-wrap gap-2">
              {toolChains.map((chain) => (
                <span
                  key={chain.id}
                  className={cn('chain-badge', chain.color)}
                >
                  {chain.label}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-muted-foreground leading-relaxed">
                {tool.longDescription || tool.description}
              </p>
            </div>

            {/* Stats Grid */}
            {(tool.tvl || tool.volume24h || tool.users || tool.launchDate) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tool.tvl && (
                  <div className="glass-card p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <DollarSign className="w-3.5 h-3.5" />
                      TVL
                    </div>
                    <p className="text-lg font-semibold text-foreground">{tool.tvl}</p>
                  </div>
                )}
                {tool.volume24h && (
                  <div className="glass-card p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Activity className="w-3.5 h-3.5" />
                      24h Volume
                    </div>
                    <p className="text-lg font-semibold text-foreground">{tool.volume24h}</p>
                  </div>
                )}
                {tool.users && (
                  <div className="glass-card p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Users className="w-3.5 h-3.5" />
                      Users
                    </div>
                    <p className="text-lg font-semibold text-foreground">{tool.users}</p>
                  </div>
                )}
                {tool.launchDate && (
                  <div className="glass-card p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      Launch
                    </div>
                    <p className="text-sm font-semibold text-foreground">{tool.launchDate}</p>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {tool.socialLinks && Object.keys(tool.socialLinks).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Links & Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.socialLinks.twitter && (
                    <a
                      href={tool.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  {tool.socialLinks.discord && (
                    <a
                      href={tool.socialLinks.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Discord
                    </a>
                  )}
                  {tool.socialLinks.telegram && (
                    <a
                      href={tool.socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Telegram
                    </a>
                  )}
                  {tool.socialLinks.github && (
                    <a
                      href={tool.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {tool.socialLinks.docs && (
                    <a
                      href={tool.socialLinks.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Docs
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            {tool.reviews && tool.reviews.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Community Reviews</h3>
                <div className="space-y-3">
                  {tool.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="glass-card p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs font-bold text-foreground">
                            {review.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {review.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'w-3 h-3',
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-muted-foreground/30'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground/60">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Button
              onClick={handleVisit}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Visit {tool.name}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

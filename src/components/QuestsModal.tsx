import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { 
  Rocket, 
  Compass, 
  Heart, 
  MessageSquare, 
  Wallet, 
  Zap, 
  Bookmark, 
  Star,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  rocket: <Rocket className="w-5 h-5" />,
  compass: <Compass className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  'message-square': <MessageSquare className="w-5 h-5" />,
  wallet: <Wallet className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  bookmark: <Bookmark className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
};

interface QuestsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestsModal({ open, onOpenChange }: QuestsModalProps) {
  const { quests, activeQuests, completedQuests, loading, fetchQuests } = useQuests();
  const { profile } = useAuth();

  useEffect(() => {
    if (open) {
      fetchQuests();
    }
  }, [open, fetchQuests]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Trophy className="w-6 h-6 text-primary" />
            Quests & Achievements
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{profile?.points || 0}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">Lv {profile?.level || 1}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{completedQuests.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {activeQuests.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Active Quests
                  </h3>
                  <div className="space-y-3">
                    {activeQuests.map((quest) => (
                      <div
                        key={quest.id}
                        className="p-4 rounded-xl bg-secondary/30 border border-border/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {iconMap[quest.icon || 'star'] || <Star className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{quest.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                +{quest.points} pts
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {quest.description}
                            </p>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="text-foreground font-medium">
                                  {quest.progress}/{quest.target_value}
                                </span>
                              </div>
                              <Progress 
                                value={(quest.progress / quest.target_value) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedQuests.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Completed Quests
                  </h3>
                  <div className="space-y-3">
                    {completedQuests.map((quest) => (
                      <div
                        key={quest.id}
                        className="p-4 rounded-xl bg-primary/5 border border-primary/20"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{quest.title}</h4>
                              <Badge className="text-xs bg-primary/20 text-primary border-0">
                                +{quest.points} pts
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {quest.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quests.length === 0 && (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No quests available yet</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

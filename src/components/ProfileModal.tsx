import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useBadges } from '@/hooks/useBadges';
import { User, Wallet, Trophy, Star, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, profile, updateProfile } = useAuth();
  const { userBadges, loading: badgesLoading } = useBadges();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ username, bio });
    setSaving(false);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
      setEditing(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'epic':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'rare':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <User className="w-6 h-6 text-primary" />
            Your Profile
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-100px)] pr-4">
          <div className="space-y-6">
            {/* Avatar and basic info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/50">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {profile?.username?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                {editing ? (
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="search-input"
                    placeholder="Username"
                  />
                ) : (
                  <h3 className="text-xl font-bold">{profile?.username || 'User'}</h3>
                )}
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {profile?.wallet_address && (
                  <p className="text-xs text-primary font-mono flex items-center gap-1 mt-1">
                    <Wallet className="w-3 h-3" />
                    {truncateAddress(profile.wallet_address)}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-secondary/30">
                <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold">{profile?.points || 0}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/30">
                <Star className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-lg font-bold">Lv {profile?.level || 1}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/30">
                <p className="text-2xl mb-1">🏆</p>
                <p className="text-lg font-bold">{userBadges.length}</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label className="text-sm text-muted-foreground">Bio</Label>
              {editing ? (
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-2 search-input"
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              ) : (
                <p className="mt-2 text-sm">
                  {profile?.bio || 'No bio yet. Click edit to add one!'}
                </p>
              )}
            </div>

            {/* Badges */}
            {userBadges.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground">Badges</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userBadges.map((badge) => (
                    <Badge
                      key={badge.id}
                      className={cn('px-3 py-1.5', getRarityColor(badge.rarity))}
                    >
                      <span className="mr-1">{badge.icon}</span>
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Edit buttons */}
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setUsername(profile?.username || '');
                      setBio(profile?.bio || '');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
                  className="w-full"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  LogOut, 
  Heart, 
  Trophy, 
  Medal, 
  Settings,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}

interface UserMenuProps {
  onOpenProfile: () => void;
  onOpenQuests: () => void;
  onOpenLeaderboard: () => void;
}

export function UserMenu({ onOpenProfile, onOpenQuests, onOpenLeaderboard }: UserMenuProps) {
  const navigate = useNavigate();
  const { user, profile, signOut, connectWallet } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask');
      return;
    }

    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts[0]) {
        await connectWallet(accounts[0]);
        toast.success('Wallet connected!');
      }
    } catch {
      toast.error('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (!user) {
    return (
      <Button onClick={() => navigate('/auth')} variant="default" size="sm">
        Sign In
      </Button>
    );
  }

  const initials = profile?.username?.slice(0, 2).toUpperCase() || 
    user.email?.slice(0, 2).toUpperCase() || 'U';

  const truncateAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {profile && (
            <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Lv{profile.level}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">
            {profile?.username || 'User'}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
          {profile?.wallet_address && (
            <p className="text-xs text-primary font-mono">
              {truncateAddress(profile.wallet_address)}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              {profile?.points || 0} points
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenQuests} className="cursor-pointer">
          <Trophy className="mr-2 h-4 w-4" />
          <span>Quests</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenLeaderboard} className="cursor-pointer">
          <Medal className="mr-2 h-4 w-4" />
          <span>Leaderboard</span>
        </DropdownMenuItem>
        {!profile?.wallet_address && (
          <DropdownMenuItem 
            onClick={handleWalletConnect} 
            className="cursor-pointer"
            disabled={connecting}
          >
            <Wallet className="mr-2 h-4 w-4" />
            <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState } from 'react';
import { Boxes, Github } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { ProfileModal } from './ProfileModal';
import { QuestsModal } from './QuestsModal';
import { LeaderboardModal } from './LeaderboardModal';

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [questsOpen, setQuestsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Boxes className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent blur-lg opacity-50" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="gradient-text">Web3</span>
                <span className="text-foreground">Hub</span>
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">All tools. One place.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 rounded-full border border-border/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <UserMenu
              onOpenProfile={() => setProfileOpen(true)}
              onOpenQuests={() => setQuestsOpen(true)}
              onOpenLeaderboard={() => setLeaderboardOpen(true)}
            />
          </div>
        </div>
      </header>

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
      <QuestsModal open={questsOpen} onOpenChange={setQuestsOpen} />
      <LeaderboardModal open={leaderboardOpen} onOpenChange={setLeaderboardOpen} />
    </>
  );
}

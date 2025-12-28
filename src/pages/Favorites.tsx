import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { tools, Tool } from '@/data/tools';
import { ToolDetailModal } from '@/components/ToolDetailModal';
import { FavoriteToolCard } from '@/components/FavoriteToolCard';
import { Button } from '@/components/ui/button';

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const favoriteTools = useMemo(() => {
    return tools.filter((tool) => favorites.includes(tool.id));
  }, [favorites]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Sign in to view favorites</h1>
            <p className="text-muted-foreground max-w-md">
              Create an account or sign in to save your favorite DApps and access them anytime.
            </p>
            <Link to="/auth">
              <Button className="mt-4">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container py-8">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
            <Heart className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <p className="text-muted-foreground">
              {favoriteTools.length} saved DApp{favoriteTools.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : favoriteTools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Start exploring DApps and click the heart icon to save them here for quick access.
            </p>
            <Link to="/">
              <Button>Explore DApps</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool, index) => (
              <FavoriteToolCard 
                key={tool.id} 
                tool={tool} 
                index={index}
                onOpenDetail={setSelectedTool}
              />
            ))}
          </div>
        )}
      </div>

      <ToolDetailModal
        tool={selectedTool}
        open={!!selectedTool}
        onOpenChange={(open) => !open && setSelectedTool(null)}
      />
    </div>
  );
}

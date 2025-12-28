import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  toolId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ toolId, className, size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(toolId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(toolId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'p-2 rounded-full transition-all hover:scale-110',
        favorited 
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground',
        className
      )}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={cn(
          sizeClasses[size],
          favorited && 'fill-current'
        )} 
      />
    </button>
  );
}

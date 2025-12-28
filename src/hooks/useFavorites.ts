import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setFavorites(data.map((f) => f.tool_id));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (toolId: string) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    const isFavorited = favorites.includes(toolId);

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId);

      if (!error) {
        setFavorites((prev) => prev.filter((id) => id !== toolId));
        toast.success('Removed from favorites');
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, tool_id: toolId });

      if (!error) {
        setFavorites((prev) => [...prev, toolId]);
        toast.success('Added to favorites');
      }
    }
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return { favorites, loading, toggleFavorite, isFavorite };
}

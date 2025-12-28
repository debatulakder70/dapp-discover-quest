import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  points: number;
  level: number;
  rank?: number;
}

export function useLeaderboard(limit: number = 10) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, user_id, username, avatar_url, points, level')
      .order('points', { ascending: false })
      .limit(limit);

    if (!error && data) {
      const rankedData = data.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
      setLeaderboard(rankedData);
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, loading, fetchLeaderboard };
}

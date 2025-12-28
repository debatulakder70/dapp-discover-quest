import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
}

interface UserBadge extends Badge {
  earned_at: string;
}

export function useBadges() {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = useCallback(async () => {
    const { data: badges } = await supabase.from('badges').select('*');
    if (badges) setAllBadges(badges);

    if (user) {
      const { data: userBadgeData } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badges:badge_id (*)
        `)
        .eq('user_id', user.id);

      if (userBadgeData) {
        const mapped = userBadgeData.map((ub: any) => ({
          ...ub.badges,
          earned_at: ub.earned_at
        }));
        setUserBadges(mapped);
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const hasBadge = (badgeId: string) => userBadges.some((b) => b.id === badgeId);

  return { allBadges, userBadges, loading, hasBadge, fetchBadges };
}

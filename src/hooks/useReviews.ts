import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Review {
  id: string;
  user_id: string;
  tool_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export function useReviews(toolId: string) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Fetch profiles separately
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);
      
      const reviewsWithProfiles = data.map((review) => ({
        ...review,
        profiles: profilesMap.get(review.user_id) || { username: null, avatar_url: null }
      }));

      setReviews(reviewsWithProfiles);
      if (user) {
        const userRev = reviewsWithProfiles.find((r) => r.user_id === user.id);
        setUserReview(userRev || null);
      }
    }
    setLoading(false);
  }, [toolId, user]);

  const submitReview = async (rating: number, comment: string) => {
    if (!user) {
      toast.error('Please sign in to leave a review');
      return { error: new Error('Not authenticated') };
    }

    const existingReview = reviews.find((r) => r.user_id === user.id);

    if (existingReview) {
      const { error } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', existingReview.id);

      if (!error) {
        toast.success('Review updated');
        fetchReviews();
      }
      return { error };
    } else {
      const { error } = await supabase
        .from('reviews')
        .insert({ user_id: user.id, tool_id: toolId, rating, comment });

      if (!error) {
        toast.success('Review submitted');
        fetchReviews();
      }
      return { error };
    }
  };

  const deleteReview = async () => {
    if (!user || !userReview) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', userReview.id);

    if (!error) {
      toast.success('Review deleted');
      setUserReview(null);
      fetchReviews();
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    loading,
    userReview,
    averageRating,
    fetchReviews,
    submitReview,
    deleteReview
  };
}

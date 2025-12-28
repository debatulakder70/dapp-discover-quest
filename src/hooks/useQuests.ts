import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  quest_type: string;
  target_value: number;
  icon: string | null;
  is_active: boolean;
}

interface UserQuest {
  id: string;
  quest_id: string;
  progress: number;
  completed_at: string | null;
}

interface QuestWithProgress extends Quest {
  progress: number;
  completed: boolean;
}

export function useQuests() {
  const { user, profile } = useAuth();
  const [quests, setQuests] = useState<QuestWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = useCallback(async () => {
    if (!user) {
      setQuests([]);
      setLoading(false);
      return;
    }

    const [questsResult, userQuestsResult] = await Promise.all([
      supabase.from('quests').select('*').eq('is_active', true),
      supabase.from('user_quests').select('*').eq('user_id', user.id)
    ]);

    if (questsResult.data) {
      const userQuestsMap = new Map<string, UserQuest>();
      userQuestsResult.data?.forEach((uq) => userQuestsMap.set(uq.quest_id, uq));

      const questsWithProgress: QuestWithProgress[] = questsResult.data.map((quest) => {
        const userQuest = userQuestsMap.get(quest.id);
        return {
          ...quest,
          progress: userQuest?.progress ?? 0,
          completed: userQuest?.completed_at !== null && userQuest?.completed_at !== undefined
        };
      });

      setQuests(questsWithProgress);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const updateQuestProgress = async (questType: string, increment: number = 1) => {
    if (!user) return;

    const quest = quests.find((q) => q.quest_type === questType && !q.completed);
    if (!quest) return;

    const { data: existingProgress } = await supabase
      .from('user_quests')
      .select('*')
      .eq('user_id', user.id)
      .eq('quest_id', quest.id)
      .maybeSingle();

    const newProgress = (existingProgress?.progress ?? 0) + increment;
    const isCompleted = newProgress >= quest.target_value;

    if (existingProgress) {
      await supabase
        .from('user_quests')
        .update({
          progress: newProgress,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', existingProgress.id);
    } else {
      await supabase
        .from('user_quests')
        .insert({
          user_id: user.id,
          quest_id: quest.id,
          progress: newProgress,
          completed_at: isCompleted ? new Date().toISOString() : null
        });
    }

    if (isCompleted) {
      await supabase
        .from('profiles')
        .update({ points: (profile?.points ?? 0) + quest.points })
        .eq('user_id', user.id);

      toast.success(`Quest completed: ${quest.title}! +${quest.points} points`);
    }

    fetchQuests();
  };

  const completedQuests = quests.filter((q) => q.completed);
  const activeQuests = quests.filter((q) => !q.completed);

  return {
    quests,
    activeQuests,
    completedQuests,
    loading,
    updateQuestProgress,
    fetchQuests
  };
}

import { supabase } from '../supabaseClient';

export const getGameRules = async (subjectName, rankName) => {
  const { data, error } = await supabase
    .from('ranks')
    .select('difficulty_multiplier, xp_threshold')
    .eq('name', rankName)
    .single();

  if (error) return { difficulty: 1.0, threshold: 0 }; // Default fallback
  return { 
    difficulty: data.difficulty_multiplier, 
    threshold: data.xp_threshold 
  };
};
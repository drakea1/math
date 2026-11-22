'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (currentUser) => {
    if (currentUser) {
      const [profileRes, leaderboardRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', currentUser.id).single(),
        supabase.from('profiles').select('username, xp').order('xp', { ascending: false }).limit(10)
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (leaderboardRes.data) setLeaderboard(leaderboardRes.data);
    } else {
      setProfile(null);
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Check initial session on load
    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchUserData(currentUser);
      if (isMounted) setLoading(false);
    }

    initAuth();

    // 2. Listen for real-time auth changes (Sign in, Sign out, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      const nextUser = session?.user ?? null;
      setUser(nextUser);
      await fetchUserData(nextUser);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, leaderboard, loading, setProfile, refreshUserData: fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
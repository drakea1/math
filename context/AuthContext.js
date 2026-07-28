'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch profile and leaderboard concurrently in the background
        const [profileRes, leaderboardRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('profiles').select('username, xp').order('xp', { ascending: false }).limit(10)
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (leaderboardRes.data) setLeaderboard(leaderboardRes.data);
      }
      setLoading(false);
    }

    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, leaderboard, loading, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
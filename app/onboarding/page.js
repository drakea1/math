'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

// Basic profanity filter list - add any words you want to block here
const BLOCKED_WORDS = [
  "admin", "administrator", "root", "superuser", "sysadmin", "system", "moderator", 
  "mod", "staff", "support", "help", "info", "webmaster", "postmaster", "hostmaster",
  "security", "privacy", "legal", "billing", "sales", "contact", "feedback",
  "api", "dev", "developer", "test", "testing", "user", "guest", "anonymous",
  "null", "undefined", "NaN", "true", "false", "void", "none", "owner",
  "official", "verified", "update", "status", "server", "config", "setup",
  "dumb", "stupid", "idiot", "jerk", "moron", "loser", "fool", "suck", "bitch",
   "fuck", "whore", "slut", "hoe", "dick", "dicks", "whores", "sluts", 
];

export default function Onboarding() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
    };
    getUser();
  }, []);

  const containsProfanity = (text) => {
    const lowerText = text.toLowerCase();
    return BLOCKED_WORDS.some(word => lowerText.includes(word));
  };

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    // 1. Username Validation
    if (username.length < 3) {
      return setStatus({ loading: false, error: 'Username must be at least 3 characters.', success: '' });
    }
    if (containsProfanity(username)) {
      return setStatus({ loading: false, error: 'Please choose an appropriate username.', success: '' });
    }

    try {
      // 2. Save to Profiles Table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          username: username,
          xp: 0 
        });

      if (profileError) throw profileError;

      setStatus({ loading: false, error: '', success: 'Profile setup complete!' });
      setTimeout(() => router.push('/home'), 1500); 

    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome to the Hub.</h1>
      <p style={{ marginBottom: '2rem', opacity: 0.6 }}>Let's get your profile set up.</p>
      
      <form onSubmit={handleCompleteSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Username Input */}
        <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px' }}>
          <p style={{ marginBottom: '0.5rem', opacity: 0.7 }}>Choose a Username</p>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. MasterChief"
            style={{ 
              width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' 
            }} 
          />
        </div>

        {status.error && <p style={{ color: '#ff4a4a', fontSize: '0.9rem', textAlign: 'center' }}>{status.error}</p>}
        {status.success && <p style={{ color: '#d4ff00', fontSize: '0.9rem', textAlign: 'center' }}>{status.success}</p>}

        <button 
          type="submit"
          disabled={status.loading}
          style={{ padding: '1.2rem', background: 'white', color: 'black', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', opacity: status.loading ? 0.7 : 1 }}>
          {status.loading ? 'Saving...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
}
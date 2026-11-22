'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

// Support/contact email
const SUPPORT_EMAIL = 'matharoundapp@gmail.com';

// List of restricted/inappropriate words to block (extend as needed)
const profanityList = [
  'admin', 'moderator', 'support', 'staff', 'system', 'matharound', // System & brand keywords
  'damn', 'hell', 'crap', 'shit', 'fuck', 'bitch', 'ass', 'bastard', 'dick', 'pussy', 'cock', 'slut', 'whore' // Common profanity
];

const LEET_MAP = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  '$': 's',
};

const normalizeForFilter = (str) =>
  str
    .toLowerCase()
    .replace(/[013457@$]/g, (ch) => LEET_MAP[ch] || ch)
    .replace(/(.)\1+/g, '$1');

const validateUsername = (rawUsername) => {
  const username = (rawUsername || '').trim();

  if (!username) {
    return { valid: false, username, error: 'Error: Username cannot be empty!' };
  }
  if (username.length < 3) {
    return { valid: false, username, error: 'Error: Username must be at least 3 characters!' };
  }
  if (username.length > 20) {
    return { valid: false, username, error: 'Error: Username must be 20 characters or fewer!' };
  }
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return {
      valid: false,
      username,
      error: 'Error: Use only letters, numbers, underscores (_), and periods (.).'
    };
  }
  if (/^[._]|[._]$|\.\.|__/.test(username)) {
    return {
      valid: false,
      username,
      error: 'Error: Cannot start/end with . or _ or contain .. or __.'
    };
  }

  const normalized = normalizeForFilter(username);
  const hasBlockedWord = profanityList.some((word) =>
    normalized.includes(normalizeForFilter(word))
  );

  if (hasBlockedWord) {
    return { valid: false, username, error: 'Error: Inappropriate or restricted username detected!' };
  }

  return { valid: true, username, error: null };
};

export default function Profile() {
  const { user, profile, setProfile } = useAuth();
  const [activeView, setActiveView] = useState('hub'); // 'hub', 'profile', or 'settings'
  const [profileData, setProfileData] = useState({ username: '', xp: 0 });
  const [newUsername, setNewUsername] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Contact pop-up modal state
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // New state variables for email change and account deletion
  const [newEmail, setNewEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
  
  const router = useRouter();

  // League calculation helper
  const getLeague = (xp) => {
    const leagues = [
      { name: 'Bronze', threshold: 0, color: '#cd7f32' },
      { name: 'Silver', threshold: 750, color: '#8e8e93' },
      { name: 'Gold', threshold: 1500, color: '#b78103' },
      { name: 'Platinum', threshold: 2250, color: '#0083a8' },
      { name: 'Diamond', threshold: 3000, color: '#0043fc' },
      { name: 'Master', threshold: 3750, color: '#7b00cc' },
      { name: 'Grandmaster', threshold: 4500, color: '#cc3300' },
      { name: 'Champion', threshold: 5250, color: '#009966' },
      { name: 'Legend', threshold: 6000, color: '#990099' },
      { name: 'GOAT', threshold: 100000, color: '#ff3b30' },
    ];
    const found = [...leagues].reverse().find(l => xp >= l.threshold);
    return found || leagues[0]; 
  };

  const currentLeague = getLeague(profileData.xp);

  useEffect(() => {
    // Check initial dark mode state from DOM / localStorage
    const currentTheme = localStorage.getItem('matharound_theme') || 
      (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    if (currentTheme === 'dark') {
      setIsDarkMode(true);
    }

    if (user === undefined) return;

    if (!user) {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/');
        }
      };
      checkSession();
      return;
    }

    if (profile) {
      setProfileData(profile);
      setNewUsername(profile.username || '');
    }
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [user, profile, router]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('matharound_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('matharound_theme', 'light');
      }
      return next;
    });
  };

  const handleCopyEmail = async () => {
    let didCopy = false;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(SUPPORT_EMAIL);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = SUPPORT_EMAIL;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        didCopy = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        didCopy = false;
      }
    }

    if (didCopy) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSaveUsername = async () => {
    if (!user) return;

    const check = validateUsername(newUsername);
    if (!check.valid) {
      setSaveStatus(check.error);
      return;
    }

    setSaveStatus('Saving...');
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        username: check.username, 
        xp: profileData.xp 
      });

    if (error) {
      if (error.code === '23505') {
        setSaveStatus('Error: Username taken!');
      } else {
        setSaveStatus(`Error: ${error.message}`);
      }
    } else {
      setSaveStatus('Saved!');
      const updated = { ...profileData, username: check.username };
      setProfileData(updated);
      setNewUsername(check.username);
      if (setProfile) setProfile(updated);
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user?.email) return;
    setEmailStatus('Sending confirmation...');
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setEmailStatus(`Error: ${error.message}`);
    } else {
      setEmailStatus('Check your new email inbox to confirm!');
      setTimeout(() => setEmailStatus(''), 4000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleteStatus('Deleting account...');

    const { error: rpcError } = await supabase.rpc('delete_user');

    if (rpcError) {
      setDeleteStatus(`Error: ${rpcError.message}`);
      return;
    }

    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: '700px', minHeight: '100vh', margin: '0 auto', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. MAIN HUB VIEW */}
      {activeView === 'hub' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* DYNAMIC LEAGUE SYMBOL RING DECORATION */}
          <div style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%', 
            background: 'var(--card-bg)',
            border: '2px solid var(--accent-neon)',
            boxShadow: '0 0 25px var(--accent-neon-glow, rgba(0,255,128,0.15))',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '2.5rem',
            marginBottom: '1.2rem'
          }}>
            {currentLeague.name === 'Bronze' && '🥉'}
            {currentLeague.name === 'Silver' && '🥈'}
            {currentLeague.name === 'Gold' && '🥇'}
            {currentLeague.name === 'Platinum' && '💠'}
            {currentLeague.name === 'Diamond' && '💎'}
            {currentLeague.name === 'Master' && '👑'}
            {currentLeague.name === 'Grandmaster' && '🔥'}
            {currentLeague.name === 'Champion' && '⚡'}
            {currentLeague.name === 'Legend' && '🏆'}
            {currentLeague.name === 'GOAT' && '🐐'}
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '0.3rem', color: 'var(--text-main)', fontWeight: '800', letterSpacing: '-0.03em' }}>
            {profileData.username || 'Anonymous Commander'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>{user ? user.email : 'Loading command profile...'}</p>
          
          {/* XP HERO CARD */}
          <div style={{ 
            width: '100%',
            padding: '2rem', 
            borderRadius: '24px', 
            marginBottom: '2rem', 
            background: 'var(--card-bg)',
            border: '1px solid var(--surface-border)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>TOTAL EXPERIENCE</p>
              <h2 style={{ fontSize: '2.8rem', margin: 0, fontWeight: '900', color: 'var(--accent-neon)' }}>{profileData.xp} <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>XP</span></h2>
            </div>
            <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>
              🏆
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ width: '100%', display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setActiveView('profile')} 
                style={{ 
                  flex: 1,
                  padding: '1.1rem', 
                  background: 'var(--accent-neon)', 
                  border: 'none', 
                  borderRadius: '16px', 
                  color: '#000000', 
                  cursor: 'pointer', 
                  fontWeight: '900',
                  fontSize: '1rem',
                  letterSpacing: '0.3px',
                  boxShadow: '0 4px 20px var(--accent-neon-glow, rgba(0,0,0,0.1))',
                }}
              >
                👤 Profile View
              </button>
              <button 
                onClick={() => setActiveView('settings')} 
                style={{ 
                  flex: 1,
                  padding: '1.1rem', 
                  background: 'var(--card-bg)', 
                  border: '1px solid var(--surface-border)', 
                  borderRadius: '16px', 
                  color: 'var(--text-main)', 
                  cursor: 'pointer', 
                  fontWeight: '900',
                  fontSize: '1rem',
                  letterSpacing: '0.3px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                }}
              >
                ⚙️ Settings
              </button>
            </div>

            <button
              onClick={() => {
                setCopiedEmail(false);
                setIsContactOpen(true);
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--card-bg)',
                border: '1px solid var(--surface-border)',
                borderRadius: '16px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.95rem',
                letterSpacing: '0.3px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              }}
            >
              💬 Contact & Support
            </button>
          </div>
        </div>
      )}

      {/* CONTACT POP-UP MODAL */}
      {isContactOpen && (
        <div
          onClick={() => setIsContactOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '1.8rem',
              borderRadius: '24px',
              background: 'var(--card-bg)',
              border: '1px solid var(--surface-border)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
              color: 'var(--text-main)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: '800' }}>
              Contact Support
            </h3>
            <p style={{ margin: '0 0 1.4rem 0', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Need help with your account, XP, or billing? Tap the email below to send a message.
            </p>

            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=MathAround%20Support`}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.95rem 1rem',
                borderRadius: '14px',
                background: 'var(--accent-neon)',
                color: '#000000',
                fontWeight: '900',
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxSizing: 'border-box',
                marginBottom: '0.75rem',
              }}
            >
              ✉️ {SUPPORT_EMAIL}
            </a>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={handleCopyEmail}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: copiedEmail ? 'var(--accent-neon)' : 'transparent',
                  border: copiedEmail ? 'none' : '1px solid var(--surface-border)',
                  color: copiedEmail ? '#000000' : 'var(--text-main)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {copiedEmail ? '✓ Copied!' : 'Copy Email'}
              </button>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: 'transparent',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--text-muted)',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED PROFILE VIEW */}
      {activeView === 'profile' && (
        <div>
          <button 
            onClick={() => setActiveView('hub')} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: '1.5rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            ← Back
          </button>
          
          <h2 style={{ marginBottom: '1.8rem', color: 'var(--text-main)', fontWeight: '800', fontSize: '2rem', letterSpacing: '-0.03em' }}>Profile</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ padding: '1.8rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>USERNAME</p>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: '800', margin: 0 }}>{profileData.username || 'Not set'}</h3>
            </div>

            <div style={{ padding: '1.8rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>LINKED EMAIL</p>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '700', margin: 0 }}>{user ? user.email : 'N/A'}</h3>
            </div>

            <div style={{ padding: '1.8rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>XP/RANK</p>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-neon)', fontWeight: '900', margin: 0 }}>{profileData.xp} XP ({currentLeague.name})</h3>
              </div>
              <div style={{ fontSize: '2rem' }}>
                {currentLeague.name === 'Bronze' && '🥉'}
                {currentLeague.name === 'Silver' && '🥈'}
                {currentLeague.name === 'Gold' && '🥇'}
                {currentLeague.name === 'Platinum' && '💠'}
                {currentLeague.name === 'Diamond' && '💎'}
                {currentLeague.name === 'Master' && '👑'}
                {currentLeague.name === 'Grandmaster' && '🔥'}
                {currentLeague.name === 'Champion' && '⚡'}
                {currentLeague.name === 'Legend' && '🏆'}
                {currentLeague.name === 'GOAT' && '🐐'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEDICATED SETTINGS VIEW */}
      {activeView === 'settings' && (
        <div>
          <button 
            onClick={() => setActiveView('hub')} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: '1.5rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            ← Back
          </button>
          
          <h2 style={{ marginBottom: '1.8rem', color: 'var(--text-main)', fontWeight: '800', fontSize: '2rem', letterSpacing: '-0.03em' }}>Settings</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* APPEARANCE / DARK MODE TOGGLE */}
            <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div>
                <p style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '0.2rem' }}>Interface Theme</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toggle app-wide dark mode </p>
              </div>
              <button 
                onClick={toggleDarkMode}
                style={{ 
                  padding: '0.5rem 1.0rem', 
                  background: isDarkMode ? 'var(--accent-neon)' : 'var(--card-bg)', 
                  color: isDarkMode ? '#000000' : 'var(--text-main)', 
                  border: isDarkMode ? 'none' : '1px solid var(--surface-border)', 
                  borderRadius: '15px', 
                  fontWeight: '800', 
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: isDarkMode ? '0 0 15px var(--accent-neon-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {isDarkMode ? '🌙 Dark Active' : '☀️ Light Active'}
              </button>
            </div>

            {/* USERNAME */}
            <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <p style={{ marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>EDIT USERNAME</p>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <input 
                  type="text" 
                  value={newUsername} 
                  maxLength={20}
                  onChange={(e) => setNewUsername(e.target.value)} 
                  placeholder="e.g. MathGenius99" 
                  style={{ 
                    flex: 1, 
                    padding: '0.8rem 1rem', 
                    borderRadius: '12px', 
                    background: 'var(--surface-glass, rgba(0,0,0,0.02))', 
                    border: '1px solid var(--surface-border)', 
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontWeight: '600'
                  }} 
                />
                <button 
                  onClick={handleSaveUsername} 
                  style={{ padding: '0 1.2rem', background: 'var(--accent-neon)', color: '#000000', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
              <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                3–20 chars · letters, numbers, _ or . (no leading/trailing or repeated symbols)
              </p>
              {saveStatus && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: saveStatus === 'Saved!' ? 'var(--accent-neon)' : '#ff4a4a', fontWeight: '700' }}>{saveStatus}</p>}
            </div>

            {/* CHANGE EMAIL */}
            <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <p style={{ marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>CHANGE EMAIL ADDRESS</p>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="new@email.com" 
                  style={{ 
                    flex: 1, 
                    padding: '0.8rem 1rem', 
                    borderRadius: '12px', 
                    background: 'var(--surface-glass, rgba(0,0,0,0.02))', 
                    border: '1px solid var(--surface-border)', 
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontWeight: '600'
                  }} 
                />
                <button 
                  onClick={handleUpdateEmail} 
                  style={{ padding: '0 1.2rem', background: 'var(--text-main)', color: 'var(--card-bg)', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Update
                </button>
              </div>
              {emailStatus && <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: emailStatus.includes('Error') ? '#ff4a4a' : 'var(--accent-neon)', fontWeight: '700' }}>{emailStatus}</p>}
            </div>

            {/* SECURITY */}
            <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
               <p style={{ marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>SECURITY</p>
               <button 
                 onClick={() => router.push('/reset-password')}
                 style={{ width: '100%', padding: '0.9rem', background: 'transparent', border: '1px solid var(--surface-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '700' }}
               >
                 Reset Account Password
               </button>
            </div>

            {/* LEGAL */}
            <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '20px', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <p style={{ marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>LEGAL</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => router.push('/terms-and-conditions')}
                  style={{ flex: 1, padding: '0.9rem', background: 'transparent', border: '1px solid var(--surface-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '700' }}
                >
                  Terms and Conditions
                </button>
                <button
                  onClick={() => router.push('/privacy')}
                  style={{ flex: 1, padding: '0.9rem', background: 'transparent', border: '1px solid var(--surface-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '700' }}
                >
                  Privacy Policy
                </button>
              </div>
            </div>

            {/* DANGER ZONE: DELETE PROFILE */}
            <div style={{ padding: '1.5rem', background: 'rgba(255, 74, 74, 0.03)', border: '1px solid rgba(255, 74, 74, 0.2)', borderRadius: '20px' }}>
              <p style={{ marginBottom: '0.6rem', fontSize: '0.9rem', color: '#ff4a4a', fontWeight: '800', letterSpacing: '0.05em' }}>DANGER ZONE</p>
              {!deleteConfirm ? (
                <button 
                  onClick={() => setDeleteConfirm(true)}
                  style={{ width: '100%', padding: '0.9rem', background: 'transparent', border: '1px solid #ff4a4a', borderRadius: '12px', color: '#ff4a4a', cursor: 'pointer', fontWeight: '700' }}
                >
                  Delete Account & Profile
                </button>
              ) : (
                <div>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Are you completely sure? This action is permanent and will wipe all your accumulated XP.</p>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button 
                      onClick={handleDeleteAccount}
                      style={{ flex: 1, padding: '0.9rem', background: '#ff4a4a', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontWeight: '800' }}
                    >
                      Yes, Delete
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(false)}
                      style={{ flex: 1, padding: '0.9rem', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '800' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {deleteStatus && <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#ff4a4a', fontWeight: '700' }}>{deleteStatus}</p>}
            </div>
            
            <button 
              onClick={handleLogout} 
              style={{ width: '100%', padding: '1rem', background: 'rgba(255, 74, 74, 0.08)', border: '1px solid rgba(255, 74, 74, 0.3)', borderRadius: '16px', color: '#ff4a4a', cursor: 'pointer', fontWeight: '800', marginTop: '0.5rem' }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
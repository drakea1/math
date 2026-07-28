'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, profile, setProfile } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [profileData, setProfileData] = useState({ username: '', xp: 0 });
  const [newUsername, setNewUsername] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // New state variables for email change and account deletion
  const [newEmail, setNewEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    // If AuthContext hasn't finished loading user yet, don't kick them out immediately
    if (user === undefined) return;

    if (!user) {
      // Give a tiny grace period or check session directly before redirecting to avoid false logouts from caching lag
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

  const handleSaveUsername = async () => {
    if (!user) return;
    setSaveStatus('Saving...');
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        username: newUsername, 
        xp: profileData.xp 
      });

    if (error) {
      setSaveStatus('Error: Username taken!');
    } else {
      setSaveStatus('Saved!');
      const updated = { ...profileData, username: newUsername };
      setProfileData(updated);
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

    // Call the Supabase RPC function to delete the user from auth
    const { error: rpcError } = await supabase.rpc('delete_user');

    if (rpcError) {
      setDeleteStatus(`Error: ${rpcError.message}`);
      return;
    }

    // Sign out and redirect home
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', color: 'white' }}>
      {!showSettings ? (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{profileData.username || 'Set a Username!'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>{user ? user.email : 'Loading...'}</p>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>TOTAL EXPERIENCE</p>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: '#d4ff00' }}>{profileData.xp} XP</h2>
          </div>

          <button 
            onClick={() => setShowSettings(true)} 
            style={{ padding: '1rem 2rem', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '15px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Edit Profile & Settings
          </button>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setShowSettings(false)} 
            style={{ background: 'none', border: 'none', color: 'white', marginBottom: '2rem', cursor: 'pointer', opacity: 0.7 }}
          >
            ← Back to Profile
          </button>
          
          <h2 style={{ marginBottom: '1.5rem' }}>Settings</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* USERNAME */}
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px' }}>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.7 }}>Set Username</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="e.g. MathGenius99" style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                <button onClick={handleSaveUsername} style={{ padding: '0 1rem', background: 'white', color: 'black', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
              </div>
              {saveStatus && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: saveStatus === 'Saved!' ? '#d4ff00' : '#ff4a4a' }}>{saveStatus}</p>}
            </div>

            {/* CHANGE EMAIL */}
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px' }}>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.7 }}>Change Email Address</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@email.com" style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                <button onClick={handleUpdateEmail} style={{ padding: '0 1rem', background: 'white', color: 'black', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>
              </div>
              {emailStatus && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: emailStatus.includes('Error') ? '#ff4a4a' : '#d4ff00' }}>{emailStatus}</p>}
            </div>

            {/* SECURITY & LOGOUT */}
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px' }}>
               <p style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>Security</p>
               <button 
                 onClick={() => router.push('/reset-password')}
                 style={{ width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid white', borderRadius: '15px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
               >
                 Reset Password
               </button>
            </div>

            {/* DANGER ZONE: DELETE PROFILE */}
            <div style={{ padding: '1.5rem', background: 'rgba(255, 74, 74, 0.03)', border: '1px solid rgba(255, 74, 74, 0.2)', borderRadius: '15px' }}>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ff4a4a', fontWeight: 'bold' }}>Danger Zone</p>
              {!deleteConfirm ? (
                <button 
                  onClick={() => setDeleteConfirm(true)}
                  style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #ff4a4a', borderRadius: '10px', color: '#ff4a4a', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Delete Account & Profile
                </button>
              ) : (
                <div>
                  <p style={{ fontSize: '0.8rem', marginBottom: '0.8rem', opacity: 0.8 }}>Are you completely sure? This will wipe your profile data and sign you out.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handleDeleteAccount}
                      style={{ flex: 1, padding: '0.8rem', background: '#ff4a4a', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Yes, Delete
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(false)}
                      style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {deleteStatus && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#ff4a4a' }}>{deleteStatus}</p>}
            </div>
            
            <button 
              onClick={handleLogout} 
              style={{ padding: '1rem', background: 'rgba(255, 74, 74, 0.1)', border: '1px solid #ff4a4a', borderRadius: '15px', color: '#ff4a4a', cursor: 'pointer', fontWeight: 'bold', marginTop: '0.5rem' }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
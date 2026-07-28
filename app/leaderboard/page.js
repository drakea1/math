'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Leaderboard() {
  const { leaderboard: users, loading } = useAuth();
  const router = useRouter();

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Leaderboard</h1>
      
      {loading ? (
        <p style={{ opacity: 0.5 }}>Loading rankings...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map((user, index) => (
            <div key={index} style={{ 
              padding: '1.5rem', 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem', opacity: 0.5 }}>#{index + 1}</span>
                <span style={{ fontWeight: 'bold' }}>{user.username || 'Anonymous Player'}</span>
              </div>
              <span style={{ color: '#d4ff00' }}>{user.xp} XP</span>
            </div>
          ))}
          
          {users.length === 0 && <p style={{ opacity: 0.5 }}>No players found yet.</p>}
        </div>
      )}
    </div>
  );
}
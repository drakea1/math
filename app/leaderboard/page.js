'use client';
import { useAuth } from '../../context/AuthContext';

export default function Leaderboard() {
  const { leaderboard: users, loading } = useAuth();

  // Limit to top 100 players
  const topUsers = Array.isArray(users) ? users.slice(0, 100) : [];

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)', fontWeight: '800' }}>
        Leaderboard (TOP 100)
      </h1>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading rankings...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {topUsers.map((user, index) => (
            <div
              key={user.id || `${user.username || 'player'}-${index}`}
              style={{
                padding: '1.5rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--surface-border)',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1000px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  #{index + 1}
                </span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {user.username || 'Anonymous Player'}
                </span>
              </div>
              <span style={{ color: 'var(--accent-neon)', fontWeight: 'bold' }}>{user.xp} XP</span>
            </div>
          ))}

          {topUsers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No players found yet.</p>}
        </div>
      )}
    </div>
  );
}
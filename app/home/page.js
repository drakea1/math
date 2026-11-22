'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const getLeague = (xp) => {
  const leagues = [
    { name: 'Bronze', threshold: 0, color: '#cd7f32' },
    { name: 'Iron', threshold: 350, color: '#595959' },
    { name: 'Silver', threshold: 750, color: '#8e8e93' },
    { name: 'Gold', threshold: 1500, color: '#b78103' },
    { name: 'Emerald', threshold: 1850, color: '#00cc66' },
    { name: 'Platinum', threshold: 2250, color: '#0083a8' },
    { name: 'Sapphire', threshold: 2600, color: '#0066cc' },
    { name: 'Diamond', threshold: 3000, color: '#0043fc' },
    { name: 'Ruby', threshold: 3350, color: '#e6005c' },
    { name: 'Master', threshold: 3750, color: '#7b00cc' },
    { name: 'Grandmaster', threshold: 4500, color: '#cc3300' },
    { name: 'Ascendant', threshold: 4850, color: '#ff6600' },
    { name: 'Champion', threshold: 5250, color: '#009966' },
    { name: 'Legend', threshold: 6000, color: '#990099' },
    { name: 'Mythic', threshold: 8500, color: '#ffcc00' },
    { name: 'Immortal', threshold: 12000, color: '#e60000' },
    { name: 'Transcendent', threshold: 18000, color: '#00ffff' },
    { name: 'Cosmic', threshold: 28000, color: '#9933ff' },
    { name: 'Solar', threshold: 40000, color: '#ff9900' },
    { name: 'Galactic', threshold: 65000, color: '#3366ff' },
    { name: 'GOAT', threshold: 100000, color: '#ff3b30' },
  ];
  const found = [...leagues].reverse().find(l => xp >= l.threshold);
  return found || leagues[0];
};

const LEAGUES_LIST = [
  { name: 'Bronze', threshold: 0, icon: '🥉', color: '#cd7f32' },
  { name: 'Iron', threshold: 350, icon: '🛡️', color: '#595959' },
  { name: 'Silver', threshold: 750, icon: '🥈', color: '#8e8e93' },
  { name: 'Gold', threshold: 1500, icon: '🥇', color: '#b78103' },
  { name: 'Emerald', threshold: 1850, icon: '🟢', color: '#00cc66' },
  { name: 'Platinum', threshold: 2250, icon: '💠', color: '#0083a8' },
  { name: 'Sapphire', threshold: 2600, icon: '🔷', color: '#0066cc' },
  { name: 'Diamond', threshold: 3000, icon: '💎', color: '#0043fc' },
  { name: 'Ruby', threshold: 3350, icon: '🔴', color: '#e6005c' },
  { name: 'Master', threshold: 3750, icon: '👑', color: '#7b00cc' },
  { name: 'Grandmaster', threshold: 4500, icon: '🔥', color: '#cc3300' },
  { name: 'Ascendant', threshold: 4850, icon: '🚀', color: '#ff6600' },
  { name: 'Champion', threshold: 5250, icon: '⚡', color: '#009966' },
  { name: 'Legend', threshold: 6000, icon: '🏆', color: '#990099' },
  { name: 'Mythic', threshold: 8500, icon: '🌟', color: '#ffcc00' },
  { name: 'Immortal', threshold: 12000, icon: '💀', color: '#e60000' },
  { name: 'Transcendent', threshold: 18000, icon: '👁️', color: '#00ffff' },
  { name: 'Cosmic', threshold: 28000, icon: '🌌', color: '#9933ff' },
  { name: 'Solar', threshold: 40000, icon: '☀️', color: '#ff9900' },
  { name: 'Galactic', threshold: 65000, icon: '🪐', color: '#3366ff' },
  { name: 'GOAT', threshold: 100000, icon: '🐐', color: '#ff3b30' },
];

export default function HomeDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const [showRanksModal, setShowRanksModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (!showRanksModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showRanksModal]);

  const xp = profile?.xp || 0;
  const currentLeague = useMemo(() => getLeague(xp), [xp]);

  const subjects = [
    { id: 'addition', title: 'Addition', subtitle: 'The Foundation', icon: '➕', unlocked: true },
    { id: 'subtraction', title: 'Subtraction', subtitle: 'Take it Away', icon: '➖', unlocked: true },
    { id: 'multiplication', title: 'Multiplication', subtitle: 'Scaling Up', icon: '✖️', unlocked: true },
    { id: 'division', title: 'Division', subtitle: 'Splitting Paths', icon: '➗', unlocked: true },
    { id: 'pre-algebra', title: 'Pre-Algebra', subtitle: 'Bridging the Gap', icon: '🔢', unlocked: true },
    { id: 'algebra', title: 'Algebra', subtitle: 'Finding the Unknown', icon: '✖️', unlocked: true },
    { id: 'geometry', title: 'Geometry', subtitle: 'Shapes and Spaces', icon: '📐', unlocked: true },
    { id: 'algebra2', title: 'Algebra 2', subtitle: 'Power and Functions', icon: '📈', unlocked: true },
    { id: 'pre-calc', title: 'Pre-Calc', subtitle: 'The Horizon', icon: '🔄', unlocked: true },
    { id: 'statistics', title: 'Statistics', subtitle: 'Data and Odds', icon: '📊', unlocked: true },
    { id: 'calculus', title: 'Calculus', subtitle: 'Rates of Change', icon: '♾️', unlocked: true },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: isDesktop ? '680px' : '100%',
        margin: '0 auto',
        padding: isDesktop ? '2.5rem 1.5rem 4rem' : '1.5rem 1rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '1.25rem', minWidth: 0 }}>
        <h3
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.14rem',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          Select Subject
        </h3>
        <h1
          style={{
            fontSize: isDesktop ? '2.35rem' : '2rem',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            margin: 0,
            color: 'var(--text-main)',
          }}
        >
          Training Hub.
        </h1>
      </div>

      {/* LEAGUE CARD */}
      <div
        style={{
          width: '100%',
          padding: isDesktop ? '1.35rem 1.5rem' : '1.15rem 1.25rem',
          background: 'var(--card-bg)',
          border: `3px solid ${currentLeague.color}55`,
          borderRadius: '20px',
          marginBottom: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1rem' }}>
            CURRENT RANK
          </h3>
          <div
            style={{
              fontSize: isDesktop ? '1.65rem' : '1.45rem',
              fontWeight: '800',
              color: currentLeague.color,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentLeague.name}
          </div>
        </div>
        <div style={{ fontSize: isDesktop ? '2.25rem' : '2rem', flexShrink: 0, lineHeight: 1 }}>
          {currentLeague.name === 'Bronze' && '🥉'}
          {currentLeague.name === 'Iron' && '🛡️'}
          {currentLeague.name === 'Silver' && '🥈'}
          {currentLeague.name === 'Gold' && '🥇'}
          {currentLeague.name === 'Emerald' && '🟢'}
          {currentLeague.name === 'Platinum' && '💠'}
          {currentLeague.name === 'Sapphire' && '🔷'}
          {currentLeague.name === 'Diamond' && '💎'}
          {currentLeague.name === 'Ruby' && '🔴'}
          {currentLeague.name === 'Master' && '👑'}
          {currentLeague.name === 'Grandmaster' && '🔥'}
          {currentLeague.name === 'Ascendant' && '🚀'}
          {currentLeague.name === 'Champion' && '⚡'}
          {currentLeague.name === 'Legend' && '🏆'}
          {currentLeague.name === 'Mythic' && '🌟'}
          {currentLeague.name === 'Immortal' && '💀'}
          {currentLeague.name === 'Transcendent' && '👁️'}
          {currentLeague.name === 'Cosmic' && '🌌'}
          {currentLeague.name === 'Solar' && '☀️'}
          {currentLeague.name === 'Galactic' && '🪐'}
          {currentLeague.name === 'GOAT' && '🐐'}
        </div>
      </div>

      {/* VIEW RANKS BUTTON */}
      <button
        type="button"
        onClick={() => setShowRanksModal(true)}
        style={{
          width: '100%',
          padding: '0.95rem 1rem',
          background: 'var(--card-bg)',
          border: '2px solid var(--surface-border)',
          borderRadius: '16px',
          color: 'var(--text-main)',
          fontWeight: '700',
          fontSize: '0.9rem',
          cursor: 'pointer',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
          boxSizing: 'border-box',
        }}
      >
        🏆 View All Ranks & XP Requirements
      </button>

      {/* XP CARD */}
      <div
        style={{
          width: '100%',
          padding: isDesktop ? '1.35rem 1.5rem' : '1.15rem 1.25rem',
          background: 'var(--card-bg)',
          border: '2px solid var(--surface-border)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1rem',
              textTransform: 'uppercase',
            }}
          >
            Current Experience
          </h3>
          <div
            style={{
              fontSize: isDesktop ? '1.8rem' : '1.5rem',
              fontWeight: '800',
              color: 'var(--text-main)',
              marginTop: '0.2rem',
              wordBreak: 'break-word',
            }}
          >
            {xp.toLocaleString()}{' '}
            <span style={{ fontSize: '0.95rem', color: 'var(--accent-neon)', fontWeight: '700' }}>XP</span>
          </div>
        </div>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--accent-neon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ⚡
        </div>
      </div>

      {/* SUBJECTS LIST (SINGLE COLUMN) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '0.9rem',
          width: '100%',
        }}
      >
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className={`subject-card ${!subject.unlocked ? 'locked' : ''}`}
            onClick={() => (subject.unlocked ? router.push(`/subjects/${subject.id.trim()}`) : null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: isDesktop ? '1.15rem 1.25rem' : '1.1rem 1.15rem',
              borderRadius: '20px',
              background: 'var(--card-bg)',
              border: '2px solid var(--surface-border)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              cursor: subject.unlocked ? 'pointer' : 'default',
              boxSizing: 'border-box',
              minWidth: 0,
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: subject.unlocked ? 'var(--surface-glass)' : 'var(--surface-border)',
                  color: subject.unlocked ? 'var(--text-main)' : 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.35rem',
                  flexShrink: 0,
                }}
              >
                {subject.icon}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    margin: '0 0 0.15rem 0',
                    color: subject.unlocked ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                >
                  {subject.title}
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {subject.subtitle}
                </p>
              </div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.15rem', flexShrink: 0 }}>
              {subject.unlocked ? '➔' : '🔒'}
            </div>
          </div>
        ))}
      </div>

      {/* RANKS MODAL POPUP */}
      {showRanksModal && (
        <div
          onClick={() => setShowRanksModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card-bg)',
              border: '2px solid var(--surface-border)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '85dvh',
              overflowY: 'auto',
              padding: isDesktop ? '2rem' : '1.4rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>Rank Tiers</h2>
              <button
                type="button"
                onClick={() => setShowRanksModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {LEAGUES_LIST.map((rank) => {
                const isCurrent = currentLeague.name === rank.name;
                return (
                  <div
                    key={rank.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '16px',
                      background: isCurrent ? 'var(--surface-glass)' : 'transparent',
                      border: isCurrent ? `2px solid ${rank.color}` : '2px solid var(--surface-border)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                      <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{rank.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: '800', color: rank.color, fontSize: '1rem' }}>{rank.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {rank.threshold.toLocaleString()} XP required
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          background: rank.color,
                          color: '#fff',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}
                      >
                        CURRENT
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowRanksModal(false)}
              style={{
                width: '100%',
                marginTop: '1.25rem',
                padding: '0.9rem',
                background: 'var(--accent-neon)',
                color: '#000',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
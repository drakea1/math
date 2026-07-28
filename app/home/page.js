'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // 1. Import the global cache hook

const getLeague = (xp) => {
  const leagues = [
    { name: 'Bronze', threshold: 0, color: '#cd7f32' },
    { name: 'Silver', threshold: 750, color: '#c0c0c0' },
    { name: 'Gold', threshold: 1500, color: '#ffd700' },
    { name: 'Platinum', threshold: 2250, color: '#6ae4ff' },
    { name: 'Diamond', threshold: 3000, color: '#0043fc' },
    { name: 'Master', threshold: 3750, color: '#9d00ff' },
    { name: 'Grandmaster', threshold: 4500, color: '#ff5500' },
    { name: 'Champion', threshold: 5250, color: '#00ffaa' },
    { name: 'Legend', threshold: 6000, color: '#ff00ff' },
    { name: 'GOAT', threshold: 100000, color: '#ff0000' },
  ];
  const found = [...leagues].reverse().find(l => xp >= l.threshold);
  return found || leagues[0]; 
};

export default function HomeDashboard() {
  const router = useRouter();
  const { profile, loading } = useAuth(); // 2. Pull cached profile & loading state

  // Get XP safely from cached profile (defaults to 0 if loading or missing)
  const xp = profile?.xp || 0;
  const currentLeague = useMemo(() => getLeague(xp), [xp]);

  // (Optional) You can handle a lightning-fast skeleton/loader state here if you want:
  // if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading Training Hub...</div>;

  const subjects = [
    { id: 'addition', title: 'Addition', subtitle: 'The Foundation', icon: '➕', unlocked: true },
    { id: 'subtraction', title: 'Subtraction', subtitle: 'Take it Away', icon: '➖', unlocked: true },
    { id: 'multiplication', title: 'Multiplication', subtitle: 'Scaling Up', icon: '✖️', unlocked: true },
    { id: 'division', title: 'Division', subtitle: 'Splitting Paths', icon: '➗', unlocked: true },
    { id: 'pre-algebra ', title: 'Pre-Algebra', subtitle: 'Bridging the Gap', icon: '🔢', unlocked: true },
    { id: 'algebra', title: 'Algebra', subtitle: 'Finding the Unknown', icon: '✖️', unlocked: true },
    { id: 'algebra 2', title: 'Algebra 2', subtitle: 'Power and Functions', icon: '📈', unlocked: true },
    { id: 'geometry', title: 'Geometry', subtitle: 'Shapes and Spaces', icon: '📐', unlocked: true },
    { id: 'pre-calc', title: 'Pre-Calc', subtitle: 'The Horizon', icon: '🔄', unlocked: true },
    { id: 'statistics', title: 'Statistics', subtitle: 'Data and Odds', icon: '📊', unlocked: true },
    { id: 'calculus', title: 'Calculus', subtitle: 'Rates of Change', icon: '♾️', unlocked: true },
  ];

  return (
    <div style={{ minHeight: '235vh', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column' }}>
    
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.15rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Select Protocol
        </h3>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', margin: 0, color: '#fff' }}>
          Training Hub.
        </h1>
      </div>

     {/* LEAGUE CARD */}
     <div style={{ 
       padding: '1.5rem', 
       background: 'rgba(255, 255, 255, 0.05)',
       border: `1px solid ${currentLeague.color}44`, 
       borderRadius: '24px',
       backdropFilter: 'blur(10px)', 
       WebkitBackdropFilter: 'blur(10px)',
       contain: 'paint', 
       willChange: 'transform',
       marginBottom: '2.2rem',
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
       boxShadow: `0 0 20px ${currentLeague.color}22`
     }}>
       <div>
         <h3 style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.1rem' }}>CURRENT RANK</h3>
         <div style={{ fontSize: '1.8rem', fontWeight: '800', color: currentLeague.color }}>
           {currentLeague.name}
         </div>
       </div>
       <div style={{ fontSize: '2.5rem' }}>
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
      
      {/* XP CARD */}
      <div style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        marginBottom: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.1rem', textTransform: 'uppercase' }}>Current Experience</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginTop: '0.2rem' }}>
            {xp} <span style={{ fontSize: '1rem', color: '#00ffcc', fontWeight: '600' }}>XP</span>
          </div>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #00ffcc', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
          ⚡
        </div>
      </div>

      {/* SUBJECTS GRID */}
      <div style={{
         display: 'flex',
          flexDirection: 'column',
            gap: '1.8rem',
            contain: 'layout paint' 
            }}>

        {subjects.map((subject) => (
          <div
            key={subject.id}
            className={`subject-card ${!subject.unlocked ? 'locked' : ''}`}
            onClick={() => subject.unlocked ? router.push(`/subjects/${subject.id}`) : null}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ 
                width: '50px', height: '50px', borderRadius: '14px', 
                backgroundColor: subject.unlocked ? '#fff' : 'rgba(255, 255, 255, 0.1)', 
                color: subject.unlocked ? '#000' : 'rgba(255, 255, 255, 0.3)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: '1.5rem', fontWeight: 'bold'
              }}>
                {subject.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.2rem 0', color: subject.unlocked ? '#fff' : 'rgba(255, 255, 255, 0.5)' }}>
                  {subject.title}
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                  {subject.subtitle}
                </p>
              </div>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '1.2rem' }}>
              {subject.unlocked ? '➔' : '🔒'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}